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
    type: Array,
    requried: true,
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
    }
  },
  Price: {
    type: String,
    required: true,
  },
  propertyImage: {
    type: Array,
    required: true,
  },
  sqft: {
    type: String,
    requried: true,
  },
});


const property = mongoose.model<IProperty>('Property',propertySchema)
export default property