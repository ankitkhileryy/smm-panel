const mongoose = require("mongoose");
const uri = "mongodb+srv://ankitbishnoi9928154849_db_user:FNuP7OPpAKwhVh2m@smmdb.unmdd85.mongodb.net/smmdb?appName=smmdb";

async function run() {
    await mongoose.connect(uri);
    const Service = mongoose.models.Service || mongoose.model('Service', new mongoose.Schema({ category: String }));
    const cats = await Service.distinct('category');
    console.log("Found categories:", JSON.stringify(cats));
    process.exit(0);
}
run().catch(console.error);
