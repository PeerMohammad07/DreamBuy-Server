import mongoose, { Schema } from "mongoose";
import { IWhishlist } from "../../entity/allEntity";

const whishListSchema = new Schema({
  propertyId : {
    type : mongoose.Types.ObjectId,
    required:true
  },
  userId : {
    type : mongoose.Types.ObjectId,
    required:true
  }
})

const whishListModel = mongoose.model<IWhishlist>("whishlist",whishListSchema)

export default whishListModel