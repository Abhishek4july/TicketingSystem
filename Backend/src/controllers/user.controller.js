import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { Ticket } from "../models/ticket.model.js";

const generateAccessAndRefreshTokens=async(userId)=>{
   try {
       const user=await User.findById(userId)
       const accessToken=user.generateAccessToken();
       const refreshToken=user.generateRefreshToken();
       user.refreshToken=refreshToken
       user.save({validateBeforeSave:false})
       return {accessToken,refreshToken}
   } catch (error) {
      throw new ApiError(500,"Something went wrong while generating refresh and access token")
   }
}


const registerUser=asyncHandler(async (req,res)=>{
   const {FullName,email,password}=req.body
   console.log("Request Body:", req.body);  

     if (
        [FullName,email,password].some((field)=>(field?.trim()===''))
     ) {
        throw new ApiError(400,"All fields are required")
     }
     console.log(req.body);
     
     const existedUser=await User.findOne({email})
     
     if (existedUser) {
      return res.status(409).json(new ApiResponse(409, null, "User with this email already exists"));
   }
   
   

     const user=await User.create({
        FullName,
        email,
        password,
      //   role
     })

    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )
})


const loginUser=asyncHandler(async(req,res)=>{
   const {email,password}=req.body

   if(!email){
      throw new ApiError(400,"Email is required")
   }
   const user=await User.findOne({email})

   if(!user){
      throw new ApiError(404,"User does not exist")
   }

   const isPasswordValid=await user.isPasswordCorrect(password)
    
   if(!isPasswordValid){
      throw new ApiError(401,"Inavild user credentials")
   }
   const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)

   const loggedInUser=await User.findById(user._id).select(
      "-password -refreshToken"
   )
  
   console.log("logged in with email",email)
   const options={
      httpOnly:true,
      secure:true,
   }

   return res
   .status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(
      new ApiResponse(
         200,
         {
            user:loggedInUser,accessToken,refreshToken
         },
         "User logged in successfully"
      )
   )
})

const logoutUser=asyncHandler(async(req,res)=>{
 await User.findByIdAndUpdate(
   req.user._id,
   {
      $set:{
        refreshToken:undefined
      }
   },
   {
      new:true
   }
 ) 

 const options={
   httpOnly:true,
   secure:true
}

  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200,{},"User logged out"))
})


const refreshAccessToken=asyncHandler(async(req,res)=>{
   const incomingRefreshToken=req.cookies.refreshToken||req.body.refreshToken

   if(!incomingRefreshToken){
      throw new ApiError(401,"Unauthorized request")
   }
   try {
      const decodedToken=jwt.verify(
         incomingRefreshToken,
         process.env.REFRESH_TOKEN_SECRET
      )
   
      const user=await User.findById(decodedToken._id)
   
      if(!user){
         throw new ApiError(401,"Invalid refresh token")
      }
   
      if(incomingRefreshToken!==user?.refreshToken){
         throw new ApiError(401,"Refresh token is invalid or used")
      }
      const options={
         httpOnly:true,
         secure:true
      }
   
     const {accessToken,newRefreshToken}=await generateAccessAndRefreshTokens(user._id)
   
      return res
      .status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken",newRefreshToken,options)
      .json(
         new ApiResponse(
            200,
            {accessToken,refreshToken:newRefreshToken},
            "Access token refreshed"
         )
      )
   } catch (error) {
      throw new ApiError(401,error?.message||"Invalid refresh token")
   }
})


const getCurrentUser=asyncHandler(async(req,res)=>{

   return res
   .status(200)
   .json(
      new ApiResponse(200,req.user,"Current user fetched successfully")
   )
})


const getUserTickets=asyncHandler(async(req,res)=>{
   const {id:userId}=req.user;

   const tickets= await Ticket.find({createdBy:userId}).populate('createdBy','FullName email').sort({createdAt:-1})

   return res.status(200).json(
      new ApiResponse(200,tickets,"Tickets fetched succesfully")
   )
})

const getUserTicketById=asyncHandler(async(req,res)=>{
   const {ticketId}=req.params;

   const ticket=await Ticket.findById(ticketId)
   .populate("createdBy","FullName email")
   .populate("assignedTo","FullName email")

   if(!ticket){
      throw new ApiError(404,"Ticket not found")
   }
   return res.status(200).json(
      new ApiResponse(200,ticket,"Ticket fetched successfully")
   )
})


export {registerUser,loginUser,logoutUser,refreshAccessToken,getCurrentUser,getUserTickets,getUserTicketById}