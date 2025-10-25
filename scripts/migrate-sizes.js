// scripts/migrate-sizes.js
import 'dotenv/config';
import mongoose from 'mongoose';
import Product from '../src/models/Product.js'; // đường dẫn theo repo của bạn

const NEED_SIZE = new Set(['Top','Bottom']);

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('Missing MONGO_URI');
    process.exit(1);
  }
  await mongoose.connect(uri);
  console.log('Connected');

  // 1) Non Top/Bottom: clear sizes, status theo countInStock
  {
    const res = await Product.updateMany(
      { category: { $nin: Array.from(NEED_SIZE) } },
      [
        {
          $set: {
            sizes: [],
            status: {
              $cond: [
                { $gt: ["$countInStock", 0] },
                "available",
                "out_of_stock"
              ]
            }
          }
        }
      ]
    );
    console.log('Cleared sizes (non Top/Bottom):', res.modifiedCount);
  }

  // 2) Top/Bottom thiếu sizes: thêm S/M/L, dồn tồn vào M
  {
    const res = await Product.updateMany(
      {
        category: { $in: Array.from(NEED_SIZE) },
        $or: [{ sizes: { $exists: false } }, { sizes: { $size: 0 } }]
      },
      [
        {
          $set: {
            sizes: [
              { label: "S", stock: 0 },
              { label: "M", stock: { $ifNull: ["$countInStock", 0] } },
              { label: "L", stock: 0 }
            ]
          }
        },
        {
          $set: {
            status: {
              $cond: [
                { $gt: [ { $sum: "$sizes.stock" }, 0 ] },
                "available",
                "out_of_stock"
              ]
            }
          }
        }
      ]
    );
    console.log('Added default sizes (Top/Bottom):', res.modifiedCount);
  }

  // 3) Đồng bộ status cho tất cả Top/Bottom theo tổng sizes
  {
    const res = await Product.updateMany(
      { category: { $in: Array.from(NEED_SIZE) } },
      [
        {
          $set: {
            status: {
              $cond: [
                { $gt: [ { $sum: "$sizes.stock" }, 0 ] },
                "available",
                "out_of_stock"
              ]
            }
          }
        }
      ]
    );
    console.log('Recalculated status (Top/Bottom):', res.modifiedCount);
  }

  await mongoose.disconnect();
  console.log('Done.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
