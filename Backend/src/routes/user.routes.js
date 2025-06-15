import { Router } from "express";
import { getCurrentUser, loginUser, registerUser } from "../controllers/user.controller.js";
import { app } from "../app.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { logoutUser } from "../controllers/user.controller.js";
import { refreshAccessToken } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { ticketSubmission } from "../controllers/ticket.controller.js";
import { createComment, getComments } from "../controllers/comments.controller.js";
import { getUserTickets } from "../controllers/user.controller.js";
import { getUserTicketById } from "../controllers/user.controller.js";
import {getNotificationPreferences, updateNotificationPreferences} from "../controllers/email.controller.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router=Router()

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

//secured routes

router.route("/logout").post(verifyJWT,logoutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/submitTicket").post(
    verifyJWT,
      upload.array("attachments", 5), 

    ticketSubmission
)


router.route('/tickets').get(verifyJWT,getUserTickets)

router.route('/tickets/:ticketId').get(verifyJWT,getUserTicketById);

router.route('/tickets/:ticketId/comments').get(verifyJWT,getComments)

router.route('/tickets/:ticketId/comments').post(verifyJWT,
    upload.fields([
        {
            name:'attachments',
            maxCount:1
        }
    ])
    ,createComment)
router.route('/getUser').get(verifyJWT,getCurrentUser)
router.route('/preferences').get(verifyJWT,getNotificationPreferences)    
router.route('/preferences').put(verifyJWT,updateNotificationPreferences)    



export default router