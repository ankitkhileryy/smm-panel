import mongoose from "mongoose";

const PRIMARY_URI = process.env.MONGODB_URI;
const SECONDARY_URI = process.env.OLD_MONGODB_URI;

if (!PRIMARY_URI) {
    throw new Error("MONGODB_URI is missing in environment");
}

let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null, activeUri: PRIMARY_URI };
}

async function dbConnect() {
    // If we have a connection, check if it's still alive/healthy
    if (cached.conn && mongoose.connection.readyState === 1) {
        return cached.conn;
    }

    // If we are already connecting, wait for it
    if (cached.promise) {
        try {
            cached.conn = await cached.promise;
            return cached.conn;
        } catch (e) {
            // If the pending promise failed, reset and try the failover logic below
            cached.promise = null;
        }
    }

    const connect = async (uri: string) => {
        console.log(`📡 Database System: Attempting connection to ${uri === PRIMARY_URI ? 'Primary' : 'Secondary'} Node...`);
        return mongoose.connect(uri, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            family: 4,
        });
    };

    // Try to connect to the active URI (Primary by default)
    cached.promise = connect(cached.activeUri)
        .catch(async (err) => {
            console.warn("⚠️ Database Error: Active Node is unreachable or full.");

            // If primary failed, try secondary
            if (SECONDARY_URI && cached.activeUri !== SECONDARY_URI) {
                console.log("🔄 AUTO-FAILOVER: Switching to Secondary Database Node...");
                cached.activeUri = SECONDARY_URI;
                return connect(SECONDARY_URI!);
            }

            // If we're already on secondary and it failed, try primary again just in case
            if (cached.activeUri === SECONDARY_URI) {
                console.log("🔄 RECOVERY: Secondary failed, checking Primary again...");
                cached.activeUri = PRIMARY_URI!;
                return connect(PRIMARY_URI!);
            }

            throw err;
        })
        .then((m) => {
            console.log("✅ Database Engine: ONLINE");
            return m;
        });

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.error("❌ Database Engine: CRITICAL FAILURE. All nodes unreachable.");
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
