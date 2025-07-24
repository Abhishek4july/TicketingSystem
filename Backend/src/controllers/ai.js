import { getAISuggestedReply } from "../utils/openai.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const suggestReply = asyncHandler(async (req, res) => {
  const { ticketContent, comments } = req.body;

  if (!ticketContent) {
    return res.status(400).json(new ApiError(400, "Ticket content is required"));
  }

  const suggestion = await getAISuggestedReply(ticketContent, comments || []);

  return res.status(200).json(new ApiResponse(200, suggestion, "AI reply generated successfully"));
});
