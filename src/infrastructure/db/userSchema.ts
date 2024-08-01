import mongoose, { Schema } from "mongoose";
import IUser from "../../entity/allEntity";

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
    required: false
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
  },
  isPremium: {
    type: Boolean,
    required: true,
    default: false
  },
  premiumSubscription: {
    type: {
      subscriptionType: {
        type: String,
        enum: ['weekly', 'monthly', 'three_months'],
        required: false
      },
      startDate: {
        type: Date,
        required: false
      },
      expiryDate: {
        type: Date,
        required: false
      }
    },
    required: false,
    default: null
  }

});

const UserModel = mongoose.model<IUser>('User', userSchema);

export default UserModel;
