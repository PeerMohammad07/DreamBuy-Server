import sharp from "sharp";
import crypto from "crypto"

export async function sharpImage(width:number,height:number,image: string): Promise<Buffer | undefined> {
  try {       
    const buffer = Buffer.from(image,"base64")     
    return await sharp(buffer)
      .resize({ width: width , height: height, fit: "fill" })
      .toBuffer();
  } catch (error) {
    return undefined;
  }
}


export const randomImageName = (bytes = 32)=> crypto.randomBytes(bytes).toString("hex")
  
