import mongoose from "mongoose";

export interface ISettings extends mongoose.Document {
    adminEmail: string;
    profitMargin: number;
    maintenanceMode: boolean;
    broadcastMessage?: string;
    themeColor: string; // Hex color for the theme
    lastSyncAt: Date | null;
}

const SettingsSchema = new mongoose.Schema<ISettings>(
    {
        adminEmail: { type: String },
        profitMargin: { type: Number, default: 20 },
        maintenanceMode: { type: Boolean, default: false },
        broadcastMessage: { type: String },
        themeColor: { type: String, default: "#2563eb" }, // Default blue-600
        lastSyncAt: { type: Date, default: null },
    },
    { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);
