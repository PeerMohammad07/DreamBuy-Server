"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const con = await mongoose_1.default.connect(process.env.MONGO_DB_URL);
        console.log(`MongoDB connected : ${con.connection.host}`);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
};
exports.default = connectDB;
//# sourceMappingURL=db.js.map