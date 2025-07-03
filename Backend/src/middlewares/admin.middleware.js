import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const isAdmin=asyncHandler(async(req,res,next)=>{
    if(req.user?.role!=='admin'){
        throw new ApiError(403,"Access denied. For Admins Only")
    }

    next();
});

import rateLimit from "express-rate-limit";

export const aiLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 10, 
  message: "Too many AI requests, please try again in a minute",
});
