import sharp from "sharp";
import crypto from "crypto"

export async function sharpImage(image: string): Promise<Buffer | undefined> {
  try {       
    const buffer = Buffer.from(image,"base64")     
    return await sharp(buffer)
      .resize({ width: 1000, height: 500, fit: "contain" })
      .toBuffer();
  } catch (error) {
    console.log(error, "sharperror");
    return undefined;
  }
}


export const randomImageName = (bytes = 32)=> crypto.randomBytes(bytes).toString("hex")
  
