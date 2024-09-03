"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("./cloudinary"));
const fs_1 = __importDefault(require("fs"));
class ImageAndVideoUpload {
    async upload(filePath, folder) {
        console.log("reached");
        const result = await cloudinary_1.default.uploader.upload(filePath, {
            folder: folder,
        });
        fs_1.default.unlink(filePath, (err) => {
            if (err) {
                console.error("Error deleting file:", err);
            }
        });
        return result.secure_url;
    }
    async uploadVideo(filePath, folder) {
        const result = await cloudinary_1.default.uploader.upload(filePath, {
            resource_type: "video",
            folder: folder,
        });
        fs_1.default.unlink(filePath, (err) => {
            if (err) {
                console.error("Error deleting file:", err);
            }
        });
        return result.secure_url;
    }
}
exports.default = ImageAndVideoUpload;
//# sourceMappingURL=imageAndVideoUploads.js.map