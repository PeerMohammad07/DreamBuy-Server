"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const propertySchema = new mongoose_1.Schema({
    propertyName: {
        type: String,
        required: true,
    },
    sellerId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "seller",
        required: true,
    },
    propertyStatus: {
        type: Boolean,
        default: false,
    },
    propertyFor: {
        type: String,
        required: true,
    },
    propertyType: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    features: {
        type: [String],
        required: true,
    },
    noOfBedroom: {
        type: String,
        required: true,
    },
    noOfBathroom: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        location: {
            type: String,
            required: true,
        },
        latitude: {
            type: Number,
            required: true,
        },
        longitude: {
            type: Number,
            required: true,
        },
    },
    locationCoordinates: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    price: {
        type: Number,
        required: true,
    },
    propertyImage: {
        type: [String],
        required: true,
    },
    sqft: {
        type: String,
        required: true,
    },
    isBoosted: {
        type: Boolean,
        default: false,
    },
    boostDetails: {
        expiryDate: {
            type: Date,
            required: false,
        },
        boostLevel: {
            type: String,
            enum: ['1 week', '1 month', '3 month'],
            required: false,
        },
    },
}, { timestamps: true });
propertySchema.index({ locationCoordinates: '2dsphere' });
const Property = mongoose_1.default.model('Property', propertySchema);
exports.default = Property;
//# sourceMappingURL=propertySchema.js.map