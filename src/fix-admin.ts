// This script is for local admin setup only.
// Run manually with your own credentials from .env.local
// Usage: Set MONGODB_URI and ADMIN_EMAIL in .env.local, then run this script.

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function fixAdmin() {
    const uri = process.env.MONGODB_URI;
    const email = process.env.ADMIN_EMAIL;

    if (!uri || !email) {
        console.error("Set MONGODB_URI and ADMIN_EMAIL in .env.local");
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        const result = await mongoose.connection.db!.collection('users').updateOne(
            { email },
            { $set: { role: 'admin' } }
        );
        console.log(`Update Result:`, result);
        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

fixAdmin();
