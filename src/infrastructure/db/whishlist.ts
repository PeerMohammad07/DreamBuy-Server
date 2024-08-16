import mongoose, { Schema } from "mongoose";
import { IWhishlist } from "../../entity/allEntity";

const whishListSchema = new Schema({
  propertyId : {
    type : mongoose.Types.ObjectId,
<<<<<<< HEAD
    required:true,
    ref:'Property'
  },
  userId : {
    type : mongoose.Types.ObjectId,
    ref:'User',
=======
    required:true
  },
  userId : {
    type : mongoose.Types.ObjectId,
>>>>>>> 4ba3c8d (feat : whishlist feature done 👍)
    required:true
  }
})

const whishListModel = mongoose.model<IWhishlist>("whishlist",whishListSchema)

export default whishListModel