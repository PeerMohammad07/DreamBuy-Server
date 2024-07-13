import mongoose, { Schema } from "mongoose";
import IUser from "../../entity/userEntity";

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isBlocked: {
    type: Boolean,
    default: false,
    required: true
  },
  otpVerified: {
    type: Boolean,
    default: false,
    required: true
  },
  image: {
    type: String,
    required: false
  }
});

const UserModel = mongoose.model<IUser>('User', userSchema); 

export default UserModel;
