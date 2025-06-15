import { Ticket } from "../models/ticket.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import {User} from "../models/user.model.js"
import sendEmail from "../utils/emailService.js";

const getAllTickets = asyncHandler(async (req, res) => {
    const tickets = await Ticket.find()
        .populate('createdBy', 'FullName email')  
        .sort({ createdAt: -1 });  

    return res.status(200).json(new ApiResponse(200, tickets, "All tickets fetched successfully"));
});


const getFilteredTickets=asyncHandler(async(req,res)=>{
    const {status,priority,tags,startDate,endDate}=req.query;
    const filter={}

    if(status)
    filter.status=status;
    if(priority)
    filter.priority=priority;

if (tags) {
  const tagArray = tags
    .split(",")
    .map(t => t.trim())
    .filter(t => t.length > 0);

  if (tagArray.length > 0) {
    const tagRegexes = tagArray.map(tag => new RegExp(`^${tag}$`, 'i'));
    filter.tags = { $in: tagRegexes };
  }
}


    if(startDate||endDate){
        filter.createdAt={};
        if(startDate)
        filter.createdAt.$gte=new Date(startDate);
        if(endDate)
        filter.createdAt.$lte=new Date(endDate);
    }

    const tickets=await Ticket.find(filter)
    .populate("createdBy","FullName email")
    .sort({createdAt:-1})

    return res.status(200).json(
        new ApiResponse(200,tickets,"Tickets fetched successfully")
    )

    console.log("Filter object used for MongoDB query:", JSON.stringify(filter, null, 2));


})


const searchTickets = asyncHandler(async (req, res) => {
  const { searchField, searchTerm } = req.query;

  if (!searchField || !searchTerm) {
    return res.status(400).json(new ApiResponse(400, null, "Missing search parameter"));
  }

  const field = searchField.toLowerCase();
  let tickets = [];

//   console.log("Searching by:", field, "Term:", searchTerm);

 
  if (field === "ticketid") {
    if (mongoose.Types.ObjectId.isValid(searchTerm)) {
      tickets = await Ticket.find({ _id: searchTerm })
        .populate("createdBy", "FullName email")
        .sort({ createdAt: -1 });
    } else {
      tickets = [];
    }
  } else if (field === "fullname") {
    const allTickets = await Ticket.find()
      .populate({
        path: "createdBy",
        match: { FullName: { $regex: searchTerm, $options: "i" } },
        select: "FullName email",
      })
      .sort({ createdAt: -1 });

    tickets = allTickets.filter((ticket) => ticket.createdBy !== null);
  }

  return res.status(200).json(new ApiResponse(200, tickets, "Tickets fetched successfully"));
});


const sortTickets = asyncHandler(async (req, res) => {
  const { sortField, sortOrder = "asc" } = req.query;

  if (!sortField) {
    return res.status(400).json(
      new ApiResponse(400, null, "Missing sort field")
    );
  }

  let sortObj = {};

  if (sortField === "fullName") {
     sortObj["fullName"] = sortOrder === "asc" ? 1 : -1;
  } else if (sortField === "ticketId") {
    sortObj["_id"] = sortOrder === "asc" ? 1 : -1;
  } else {
    sortObj["createdAt"] = sortOrder === "asc" ? 1 : -1;
  }

//   console.log("Sort Field:", sortField, "Sort Order:", sortOrder);

  let tickets = await Ticket.find()
    .populate("createdBy", "FullName email")
    .sort(sortObj);


  return res.status(200).json(
    new ApiResponse(200, tickets, "Tickets sorted successfully")
  );
});




const getTicketById=asyncHandler(async(req,res)=>{
    const {ticketId}=req.params;
    const ticket=await Ticket.findById(ticketId)
    .populate("createdBy","FullName email")
    .populate("assignedTo","FullName email")
    if(!ticket){
        return res.status(404).json(
            new ApiError(404,"Ticket not found")
        )
    }
    return res.status(200).json(
        new ApiResponse(200,ticket,"Ticket fetched")
    )
})

const assignTicket=asyncHandler(async(req,res)=>{

  const {ticketId}=req.params;
  const {assignedTo}=req.body;

  try {
    const user=await User.findById(assignedTo);
    if(!user){
      return res.status(404).json(
        new ApiError(404,"User not found")
      )
    }
    const ticket=await Ticket.findByIdAndUpdate(ticketId,
      {assignedTo},
      {new:true}
    ).populate("createdBy assignedTo");
    if(!ticket){
      return res.status(404).json(
        new ApiError(404,"Ticket not found")
      )
    }
    return res.status(200).json(
      new ApiResponse(201,ticket,"Ticket assigned successfully")
    )
  } catch (error) {
    return res.status(500).json(
      new ApiError(500,"Server error")
    )
  }
})

const getAllUsers=asyncHandler(async(req,res)=>{
  const users=await User.find({},"FullName email");
  return res.status(200).json(
    new ApiResponse(200,users,"All users are fetched successfully")
  )
})


const updateTicketStatusPriority=asyncHandler(async(req,res)=>{
  const {ticketId}=req.params;
  const {status,priority}=req.body;

  try {
const ticket = await Ticket.findById(ticketId).populate("createdBy", "FullName email notificationPreferences");
    if(!ticket){
      return res.status(404).json(
        new ApiResponse(404,"Ticket not found")
      )
    }
    const oldStatus=ticket.status;

    if (status) {
  ticket.status = status;

  if (status.toLowerCase() === "closed" && oldStatus.toLowerCase() !== "closed") {
    ticket.closedAt = new Date();
  }
}

    if(priority)ticket.priority=priority;
    
    await ticket.save();

        const user = ticket.createdBy;

    
    if(status&&status!==oldStatus){
if (
  user &&
  user.notificationPreferences &&
  user.notificationPreferences.notifyOnStatusChange
) {
  await sendEmail({
    to: user.email,
    subject: `Ticket ${ticket._id} Status updated.`,
    text: `Hello ${user.FullName}, your ticket "${ticket.subject}" status has been updated to "${status}".`,
    html: `<p>Hello <strong>${user.FullName}</strong>,</p>
           <p>Your ticket "<strong>${ticket.subject}</strong>" status has been updated to "<strong>${status}</strong>".</p>`,
  });
}
   console.log("Setting closedAt:", ticket.closedAt);

    }
    const updatedTicket=await Ticket.findById(ticketId)
    .populate("createdBy","FullName email")
    .populate("assignedTo","FullName email");

    return res.status(200).json(
      new ApiResponse(200,updatedTicket,"Ticket updated succesfully")
    )

  } catch (error) {
    console.error("Update failed:", error)
    return res.status(500).json(
      new ApiError(500,"Update failed")
    )
  }
})

const getSupportStaff=asyncHandler(async(req,res)=>{
   const supportStaff=await User.find({role:'support_staff'}).select("_id FullName email");
   return res.status(200).json(
      new ApiResponse(200,supportStaff,"Support staffs fetched successfully")
   )
})

export {getFilteredTickets,getSupportStaff,updateTicketStatusPriority,getAllUsers,searchTickets,assignTicket,sortTickets,getAllTickets,getTicketById}