import crypto from "crypto";

export function generateChecksum(payload: any, endpoint: string, saltKey: string, saltIndex: string) {
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");
    const stringToHash = base64Payload + endpoint + saltKey;
    const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
    return `${sha256}###${saltIndex}`;
}

export function generateStatusChecksum(merchantTransactionId: string, merchantId: string, saltKey: string, saltIndex: string) {
    const endpoint = `/pg/v1/status/${merchantId}/${merchantTransactionId}`;
    const stringToHash = endpoint + saltKey;
    const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
    return `${sha256}###${saltIndex}`;
}
