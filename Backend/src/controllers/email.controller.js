import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const updateNotificationPreferences = asyncHandler(async (req, res) => {
  const preferences = req.body;

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  user.notificationPreferences = {
    ...user.notificationPreferences,
    ...preferences
  };

  await user.save();

  res.status(200).json(
    new ApiResponse(200, user.notificationPreferences, "Preferences updated")
  );
});

const getNotificationPreferences = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId).select('notificationPreferences');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json(
    new ApiResponse(200, user.notificationPreferences,"Notifications fetched")
  );
});


export  {updateNotificationPreferences,getNotificationPreferences}