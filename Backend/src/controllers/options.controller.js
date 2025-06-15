import { Ticket } from "../models/ticket.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const priorityValues=asyncHandler(async(req,res)=>{
    const enumValues=Ticket.schema.path('priority').enumValues;
    return res.status(200).json(
        new ApiResponse(200,enumValues,"Priorities fetched successfully")
    )
})

export const statusOptions=asyncHandler(async(req,res)=>{
    const statusValues=Ticket.schema.path('status').enumValues;
    return res.status(200).json(
        new ApiResponse(200,statusValues,"Status options fetched Successfully")
    )
})