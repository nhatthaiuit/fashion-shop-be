import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

async function cleanProductNames() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");

        const products = await Product.find({});
        console.log(`Found ${products.length} products.`);

        let updatedCount = 0;
        for (const product of products) {
            if (product.product_name.includes(' - product')) {
                const newName = product.product_name.replace(/ - products?_\d+/i, '');
                if (newName !== product.product_name) {
                    const oldName = product.product_name;
                    product.product_name = newName;
                    await product.save();
                    updatedCount++;
                    console.log(`Updated: "${oldName}" -> "${newName}"`);
                }
            }
        }

        console.log(`✅ Updated ${updatedCount} product names.`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Error cleaning product names:", error);
        process.exit(1);
    }
}

cleanProductNames();
