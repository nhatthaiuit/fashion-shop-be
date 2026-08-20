import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import Product from './models/Product.js';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dq7yrpa1f',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const IMG_DIR = '/Users/tuongvi2407/Downloads/Thai/web_ThoiTrang-main/img';

const categoryMap = {
  'T_shirt': 'Top',
  'Bottom': 'Bottom',
  'Accessories': 'Accessories',
  'products': 'Sale'
};

const topNames = ["Premium Vintage Wash T-Shirt", "Oversized Graphic Tee", "Essential Cotton Crewneck", "Classic Fit Polo", "Streetwear Drop Shoulder Tee", "Signature Logo T-Shirt", "Minimalist Block Tee", "Urban Style Hoodie", "Lightweight Summer Top"];
const bottomNames = ["Classic Fit Denim Jeans", "Cargo Tactical Pants", "Straight Leg Chinos", "Relaxed Fit Sweatpants", "Vintage Wash Jeans", "Slim Fit Tailored Trousers", "Street Style Joggers", "Summer Linen Shorts", "Utility Cargo Shorts"];
const accessoryNames = ["Signature Leather Tote", "Classic Canvas Backpack", "Minimalist Crossbody Bag", "Premium Leather Belt", "Vintage Aviator Sunglasses", "Streetwear Bucket Hat", "Essential Beanie", "Urban Messenger Bag", "Classic Wristwatch"];
const saleNames = ["Flash Sale Signature Tee", "Clearance Vintage Pants", "Last Chance Hoodie", "Discounted Premium Bag", "Special Offer Jacket", "Outlet Exclusive T-Shirt"];

function getRandomName(category) {
    const list = category === 'Top' ? topNames : category === 'Bottom' ? bottomNames : category === 'Accessories' ? accessoryNames : saleNames;
    return list[Math.floor(Math.random() * list.length)];
}

function getRandomPrice() {
    // 300,000 to 1,500,000, rounded to nearest 10,000
    const min = 30;
    const max = 150;
    const price = Math.floor(Math.random() * (max - min + 1)) + min;
    return price * 10000;
}

async function uploadImage(filePath) {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'fashion-shop',
        });
        return result.secure_url;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return null;
    }
}

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");

        console.log("🗑️ Deleting old products...");
        await Product.deleteMany();
        console.log("✅ Old products deleted.");

        const newProducts = [];
        const folders = ['T_shirt', 'Bottom', 'Accessories', 'products'];

        for (const folder of folders) {
            const folderPath = path.join(IMG_DIR, folder);
            if (!fs.existsSync(folderPath)) continue;

            const category = categoryMap[folder];
            const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));

            console.log(`📁 Processing ${folder} -> Category: ${category} (${files.length} images)`);

            for (const file of files) {
                const filePath = path.join(folderPath, file);
                console.log(`   Uploading ${file}...`);
                const imageUrl = await uploadImage(filePath);

                if (imageUrl) {
                    const price = getRandomPrice();
                    const product = new Product({
                        product_name: getRandomName(category) + " - " + file.split('.')[0], // Append file name to ensure uniqueness or just for tracking
                        category: category,
                        image: imageUrl,
                        price: price,
                        description: `Experience the comfort and style with our premium ${category.toLowerCase()} collection. Crafted with high-quality materials for everyday wear.`,
                        count_in_stock: Math.floor(Math.random() * 50) + 10,
                        sizes: [
                            { label: 'S', stock: Math.floor(Math.random() * 20) },
                            { label: 'M', stock: Math.floor(Math.random() * 20) },
                            { label: 'L', stock: Math.floor(Math.random() * 20) },
                            { label: 'XL', stock: Math.floor(Math.random() * 20) }
                        ],
                        status: 'available',
                        rating: (Math.random() * (5 - 3) + 3).toFixed(1),
                        numReviews: Math.floor(Math.random() * 100)
                    });
                    newProducts.push(product);
                }
            }
        }

        console.log(`\n📦 Inserting ${newProducts.length} new products into database...`);
        await Product.insertMany(newProducts);
        console.log("✅ Seeding completely successful!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error during seeding:", error);
        process.exit(1);
    }
}

seed();
