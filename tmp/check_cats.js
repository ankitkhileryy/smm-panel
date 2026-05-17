// Local utility script — uses MONGODB_URI from .env.local
// Run: node -r dotenv/config tmp/check_cats.js

const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

async function run() {
    const uri = process.env.MONGODB_URI;
    if (!uri) { console.error("Set MONGODB_URI in .env.local"); process.exit(1); }
    await mongoose.connect(uri);
    const Service = mongoose.models.Service || mongoose.model('Service', new mongoose.Schema({ category: String }));
    const cats = await Service.distinct('category');
    console.log("Found categories:", JSON.stringify(cats));
    process.exit(0);
}
run().catch(console.error);
