import IImageAndVideoUpload from "../../Interfaces/Utils/ImageAndVideoUpload";
import cloudinary from "./cloudinary";
import fs from "fs"

class ImageAndVideoUpload implements IImageAndVideoUpload {

  async upload(filePath: string, folder: string) {
    console.log("reached")
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
    });
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      }
    });
    return result.secure_url;
  }

  async uploadVideo(filePath: string, folder: string) {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "video",
      folder: folder,
    });
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      }
    });
    return result.secure_url;
  }
}

export default ImageAndVideoUpload