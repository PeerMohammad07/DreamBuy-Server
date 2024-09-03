// Interface for upload image and video 
interface IImageAndVideoUpload {
  upload(filePath: string, folder: string): Promise<string>;
  uploadVideo(filePath: string, folder: string): Promise<string>;
}

export default IImageAndVideoUpload;
