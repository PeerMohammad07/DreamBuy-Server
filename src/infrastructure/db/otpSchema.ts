import mongoose, { Schema } from "mongoose";
import { IOtp } from "../../entity/userEntity";

const otpSchema = new Schema<IOtp>({
  otp: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date, 
    required: true,
    default: Date.now
  }
});

otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

const OtpModel = mongoose.model<IOtp>("Otp", otpSchema); 

export default OtpModel;