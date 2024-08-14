import { UploadApiResponse } from 'cloudinary';

interface IImageAndVideoUpload {
  upload(filePath: string, folder: string): Promise<string>;
  uploadVideo(filePath: string, folder: string): Promise<string>;
}

export default IImageAndVideoUpload;
