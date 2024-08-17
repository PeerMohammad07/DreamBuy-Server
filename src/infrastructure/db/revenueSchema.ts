import mongoose, { Schema } from "mongoose";
import { IRevenue } from "../../entity/allEntity";


const revenueSchema = new Schema<IRevenue>({
  transactionId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
}, { timestamps: true });

const RevenueModel = mongoose.model<IRevenue>('Revenue', revenueSchema);

export default RevenueModel;
