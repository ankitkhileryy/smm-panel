import mongoose from "mongoose";

const OLD_URI = process.env.OLD_MONGODB_URI;

export async function connectToOldDB() {
    if (!OLD_URI) return null;
    try {
        const conn = await mongoose.createConnection(OLD_URI, {
            serverSelectionTimeoutMS: 5000,
            family: 4,
        }).asPromise();
        return conn;
    } catch (err) {
        console.error("Failed to connect to Old DB:", err);
        return null;
    }
}
