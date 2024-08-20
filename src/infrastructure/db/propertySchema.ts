import mongoose, { Schema } from "mongoose";
import { IProperty } from "../../entity/allEntity";

const propertySchema = new Schema({
  propertyName: {
    type: String,
    required: true,
  },
  sellerId: {
    type: mongoose.Types.ObjectId,
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
  Price: {
    type: String, 
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
}, { timestamps: true });

propertySchema.index({ locationCoordinates: '2dsphere' });

const Property = mongoose.model<IProperty>('Property', propertySchema);
export default Property;
