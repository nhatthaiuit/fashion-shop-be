import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

async function updateSalePrices() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");

        const saleProducts = await Product.find({ category: 'Sale' });
        console.log(`Found ${saleProducts.length} sale products.`);

        let updatedCount = 0;
        for (const product of saleProducts) {
            const discountPercent = Math.floor(Math.random() * 31) + 20; 
            let originalPrice = Math.round(product.price / (1 - discountPercent / 100));
            originalPrice = Math.ceil(originalPrice / 10000) * 10000;
            
            product.original_price = originalPrice;
            await product.save();
            updatedCount++;
            console.log(`Updated ${product.product_name}: Price=${product.price}, Original=${originalPrice}`);
        }

        console.log(`✅ Updated ${updatedCount} sale products with original prices.`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Error updating sale prices:", error);
        process.exit(1);
    }
}

updateSalePrices();
