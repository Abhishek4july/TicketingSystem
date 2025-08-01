import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema=new Schema(
    {
         FullName:{
            type:String,
            required:true,
            trim:true,
            index:true
         },
         email:{
            type:String,
            required:true,
            trim:true,
            unique:true,
            index: true
         },
         password:{
            type:String,
            required:[true,"Password is required"]
         },
         role:{
            type:String,
            enum:['user','admin','support_staff'],
            default:'user',
            required:true
         },
         tickets: [{
            type: Schema.Types.ObjectId,
            ref: 'Ticket'  
          }],
          notificationPreferences: {
            notifyOnTicketCreated: { type: Boolean, default: true },
            notifyOnStatusChange: { type: Boolean, default: true },
            notifyOnAdminComment: { type: Boolean, default: true },
            notifyOnUserReply: { type: Boolean, default: true },
            notifyOnNewTicket: { type: Boolean, default: true }
        },
         refreshToken:{
            type:String
         }
    },
    {
        timestamps:true
    }
)

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password= await bcrypt.hash(this.password,8)
    next()
})

userSchema.methods.isPasswordCorrect=async function(password){
   return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
  return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            FullName:this.FullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken=function(){
   return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User=mongoose.model("User",userSchema)