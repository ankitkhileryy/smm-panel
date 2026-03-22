import dbConnect from "./src/lib/mongoose";
import Service from "./src/models/Service";

async function check() {
    await dbConnect();
    const count = await Service.countDocuments();
    const activeCount = await Service.countDocuments({ status: "Active" });
    console.log(`Total services: ${count}`);
    console.log(`Active services: ${activeCount}`);
    const sample = await Service.findOne();
    console.log("Sample service:", JSON.stringify(sample, null, 2));
    process.exit(0);
}

check();
