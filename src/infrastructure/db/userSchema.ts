import mongoose,{Schema,model} from "mongoose"; 
import IUser from "../../entity/userEntity";

const userSchema:Schema = new Schema({
  name : {
    type : String,
    required:true
  },

  email : {
    type: String,
    required: true
  },

  password : {
    type : String,
    required : true
  },

  isBlocked :{
    type : Boolean,
    default : false,
    required: true
  },

  otpVerified :{
    type :Boolean,
    default:false,
    required:true
  }

})

const Users  = mongoose.model<IUser>('Users',userSchema)

export default Users