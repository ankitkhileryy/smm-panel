export async function sendOTP(phone: string) {
    const apiKey = process.env.DGOTP_API_KEY;
    if (!apiKey) {
        console.warn("DGOTP_API_KEY not found. Simulating OTP send.");
        return { success: true, otp: "123456" }; // Mock for dev
    }

    try {
        // Standard endpoint for dgotp or similar (Adjust if necessary)
        const response = await fetch(`https://dgotp.com/api/send?key=${apiKey}&phone=${phone}&message=Your OTP for SMM12.COM is {otp}`);
        const data = await response.json();
        return data.success ? { success: true } : { success: false, message: data.message };
    } catch (e) {
        return { success: false, message: "Network Link Failure" };
    }
}

export async function verifyOTP(phone: string, otp: string) {
    const apiKey = process.env.DGOTP_API_KEY;
    if (!apiKey) return { success: otp === "123456" }; // Mock

    try {
        const response = await fetch(`https://dgotp.com/api/verify?key=${apiKey}&phone=${phone}&otp=${otp}`);
        const data = await response.json();
        return data.success ? { success: true } : { success: false, message: data.message };
    } catch (e) {
        return { success: false, message: "Verification Link Failure" };
    }
}
