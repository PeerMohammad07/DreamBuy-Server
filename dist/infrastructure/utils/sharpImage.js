"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomImageName = void 0;
exports.sharpImage = sharpImage;
const sharp_1 = __importDefault(require("sharp"));
const crypto_1 = __importDefault(require("crypto"));
async function sharpImage(width, height, image) {
    try {
        const buffer = Buffer.from(image, "base64");
        return await (0, sharp_1.default)(buffer)
            .resize({ width: width, height: height, fit: "fill" })
            .toBuffer();
    }
    catch (error) {
        return undefined;
    }
}
const randomImageName = (bytes = 32) => crypto_1.default.randomBytes(bytes).toString("hex");
exports.randomImageName = randomImageName;
//# sourceMappingURL=sharpImage.js.map