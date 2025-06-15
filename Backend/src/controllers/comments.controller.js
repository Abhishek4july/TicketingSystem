import { Comments } from "../models/comments.model.js";
import { Ticket } from "../models/ticket.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import sendEmail from "../utils/emailService.js";

const createComment=asyncHandler(async(req,res)=>{
    const {ticketId}=req.params;
    const ticket = await Ticket.findById(ticketId).populate('createdBy');  
    if(!ticket){
        throw new ApiError(404,"Ticket not found")
    }
    if (
        req.user.role !== 'admin' && 
ticket.createdBy._id.toString() !== req.user._id.toString()
      ) {
        throw new ApiError(403, "Not authorized to comment on this ticket");
      }
    const {content}=req.body;
    let attachmentsLocalPath = null;
if (req.files && req.files.attachments && req.files.attachments.length > 0) {
  attachmentsLocalPath = req.files.attachments[0].path;
}


//    const attachmentsLocalPath=req.files?.attachments[0]?.path
   
   const attachments=await uploadOnCloudinary(attachmentsLocalPath)

   if((!(content||attachments))){
    throw new ApiError(400,"Content or attachments is required")
   }

   const attachmentData = attachments ? [{
    url: attachments.url,
    publicId: attachments.public_id,
    fileName: attachments.original_filename,
    mimeType: attachments.resource_type,
    size: attachments.bytes

    
}] : [];


  
    const newComment=await Comments.create({
        ticketId,
        authorId:req.user._id,
        content,
        attachments:attachmentData
    })
   if(!newComment){
    throw new ApiError(500,"Something went wrong while commenting")
   }
    
   const populatedComment = await Comments.findById(newComment._id).populate('authorId', 'FullName');

 const ticketCreator = await User.findById(ticket.createdBy);

if (req.user.role === "admin" && ticketCreator.notificationPreferences?.notifyOnAdminComment) {
  await sendEmail({
    to: ticketCreator.email,
    subject: `Admin replied to your ticket ${ticket._id}.`,
    text: `Hello ${ticketCreator.FullName}, admin has commented on your ticket "${ticket.subject}."`,
    html: `<p>Hello <strong>${ticketCreator.FullName}</strong>,</p>
           <p>An admin has commented on your ticket "<strong>${ticket.subject}</strong>".</p>
           <p><b>Comment:</b> ${content}</p>`,
  });
}

   else if (req.user.role === "user") {
  const admins = await User.find({ role: "admin" });
  for (const admin of admins) {
    if (admin.notificationPreferences?.notifyOnUserReply) {
      await sendEmail({
        to: admin.email,
        subject: `User replied to Ticket ${ticket._id}.`,
        text: `User ${ticket.createdBy.FullName} has replied to ticket "${ticket.subject}".`,
        html: `<p>User <strong>${ticket.createdBy.FullName}</strong> replied to the ticket "<strong>${ticket.subject}</strong>".</p>
               <p><b>Comment:</b> ${content}</p>`
      });
    }
  }
}


   return res.status(201).json(
    new ApiResponse(200,populatedComment,"Comment saved successfully")
   )
})


const getComments = asyncHandler(async (req, res) => {
    const { ticketId } = req.params;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        throw new ApiError(404, "Ticket not found");
    }

    if (req.user.role !== 'admin' && ticket.createdBy._id.toString() !== req.user._id.toString()
) {
        throw new ApiError(403, "Not authorized to view this ticket's comments");
    }

    const comments = await Comments.find({ ticketId }).populate('authorId', 'FullName').sort({ createdAt: 'asc' });

    return res.status(200).json(
        new ApiResponse(200, comments, "Comments fetched")
    );
});


export {createComment,getComments}