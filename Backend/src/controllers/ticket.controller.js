import { Ticket } from "../models/ticket.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import sendEmail from "../utils/emailService.js";
import { User } from "../models/user.model.js";
const ticketSubmission = asyncHandler(async (req, res) => {
    const user = req.user; 

  const { subject, description, priority, tags } = req.body;

  if ([subject, description, priority].some(field => !field || field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const processedTags = Array.isArray(tags)
    ? tags.map(tag => tag.trim())
    : String(tags).split(",").map(tag => tag.trim());

  let attachments = [];

if (req.files && req.files.length > 0) {
  for (const file of req.files) { 
    const uploadedFile = await uploadOnCloudinary(file.path);
     if (!uploadedFile) {
      throw new ApiError(500, `Failed to upload file: ${file.originalname}`);
    }
    attachments.push({
      url: uploadedFile.secure_url || uploadedFile.url,
      public_id: uploadedFile.public_id,
    });
  }
}

console.log("Number of files received:", req.files?.length);
console.log("Files:", req.files);



  const currentUser = await User.findById(req.user._id);

  const ticket = await Ticket.create({
    subject,
    description,
    priority,
    tags: processedTags,
    attachments,
    createdBy: req.user._id,
    fullName: currentUser?.FullName || "Unknown User"  
  });
  console.log("BODY:", req.body);
    console.log("FILES:", req.files);

  const createdTicket = await Ticket.findById(ticket._id).populate("createdBy");

  if (!createdTicket) {
    throw new ApiError(500, "Something went wrong while submitting the ticket");
  }


  if (currentUser?.notificationPreferences?.notifyOnTicketCreated) {
    await sendEmail({
      to: createdTicket.createdBy.email,
      subject: `Your Ticket ${createdTicket._id} has been created.`,
      text: `Hello ${createdTicket.createdBy.FullName}, your ticket "${createdTicket._id}" has been submitted successfully.`,
      html: `<p>Hello <strong>${createdTicket.createdBy.FullName}</strong>,</p>
             <p>Your support ticket "<strong>${createdTicket.subject}</strong>" has been submitted successfully.</p>
             <p>Status: <b>${createdTicket.status}</b></p>`
    });
  }

  const admins = await User.find({ role: "admin" });
  for (const admin of admins) {
    if (admin.notificationPreferences?.notifyOnTicketCreated) {
      await sendEmail({
        to: admin.email,
        subject: `New Ticket Submitted: ${createdTicket.subject}`,
        text: `User ${createdTicket.createdBy.FullName} submitted a new ticket: "${createdTicket.subject}"`,
        html: `<p>New ticket submitted by <strong>${createdTicket.createdBy.FullName}</strong>:</p>
               <p><b>Subject:</b> ${createdTicket.subject}</p>
               <p><b>Priority:</b> ${createdTicket.priority}</p>`
      });
    }
  }

console.log("Attachments array before save:", attachments);

  return res.status(201).json(
    new ApiResponse(201, createdTicket, "Ticket created successfully")
  );
});




export {ticketSubmission}