import QRCode from "qrcode";

export async function generateQRBase64(text: string): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(text);
    return dataUrl;
  } catch (err) {
    console.error("Error generating QR:", err);
    return "";
  }
}
