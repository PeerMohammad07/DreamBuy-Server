"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = __importDefault(require("../routes/userRoutes"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const sellerRoutes_1 = __importDefault(require("../routes/sellerRoutes"));
const adminRoutes_1 = __importDefault(require("../routes/adminRoutes"));
const cronJob_1 = __importDefault(require("../utils/cronJob"));
const chatRoutes_1 = __importDefault(require("../routes/chatRoutes"));
const path_1 = __importDefault(require("path"));
const events_1 = require("events");
const app = (0, express_1.default)();
events_1.EventEmitter.setMaxListeners(20);
// config dotenv
dotenv_1.default.config();
// Use morgan middleware to log HTTP requests
app.use((0, morgan_1.default)("dev"));
// Setting Cors
app.use((0, cors_1.default)({
    origin: ["http://localhost:5000", "https://dream-buy.vercel.app"],
    credentials: true,
}));
// Cookie Parser
app.use((0, cookie_parser_1.default)());
// Url encoding
app.use(express_1.default.json({ limit: "100mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "100mb" }));
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
// Routes
app.use("/api", userRoutes_1.default);
app.use("/api/seller", sellerRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
app.use("/api/chat", chatRoutes_1.default);
cronJob_1.default.start();
exports.default = app;
//# sourceMappingURL=app.js.map