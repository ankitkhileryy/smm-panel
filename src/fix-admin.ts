import mongoose from 'mongoose';

const uri = "mongodb+srv://ankitbishnoi9928154849_db_user:FNuP7OPpAKwhVh2m@smmdb.unmdd85.mongodb.net/smmdb?appName=smmdb";

async function fixAdmin() {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(uri);
        console.log("Connected.");

        const email = "ankitbishnoi9928154849@gmail.com";
        const result = await mongoose.connection.db.collection('users').updateOne(
            { email },
            { $set: { role: 'admin' } }
        );

        console.log(`Update Result for ${email}:`, result);

        const user = await mongoose.connection.db.collection('users').findOne({ email });
        console.log("Verified User Object:", user);

        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

fixAdmin();
