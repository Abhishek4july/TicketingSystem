import { getFilteredTickets, searchTickets,getTicketById, assignTicket, getAllUsers, updateTicketStatusPriority, getSupportStaff } from "../controllers/admin.controller.js";
import { getComments } from "../controllers/comments.controller.js";
import { aiLimiter, isAdmin } from "../middlewares/admin.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";
import { sortTickets } from "../controllers/admin.controller.js";
import { getAllTickets } from "../controllers/admin.controller.js";
import { createComment } from "../controllers/comments.controller.js";
import {getNotificationPreferences, updateNotificationPreferences} from "../controllers/email.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import getTicketAnalytics from "../controllers/analytics.controllers.js";
import { suggestReply } from "../controllers/ai.js";

const router=Router()

router.route('/tickets/filter').get(verifyJWT,isAdmin,getFilteredTickets);

router.route('/tickets/search').get(verifyJWT,isAdmin,searchTickets);

router.route('/tickets/sort').get(verifyJWT, isAdmin, sortTickets);

router.route('/tickets').get(verifyJWT,isAdmin,getAllTickets);

router.route('/tickets/:ticketId').get(verifyJWT,isAdmin,getTicketById);

router.route('/tickets/:ticketId/comments').get(verifyJWT,isAdmin,getComments)

router.route('/tickets/:ticketId/comments').post(verifyJWT,isAdmin,
    upload.fields([
        {
            name:'attachments',
            maxCount:1
        }
    ])
    ,createComment)

router.route('/tickets/:ticketId/assign').post(verifyJWT,isAdmin,assignTicket)

router.route('/users').get(verifyJWT,isAdmin,getAllUsers)

router.route('/tickets/:ticketId/update').put(verifyJWT,isAdmin,updateTicketStatusPriority)

router.route('/preferences').get(verifyJWT,isAdmin,getNotificationPreferences)
router.route('/preferences').put(verifyJWT,isAdmin,updateNotificationPreferences)

router.route('/support-staff').get(verifyJWT,isAdmin,getSupportStaff)
router.route('/analytics').get(verifyJWT,isAdmin,getTicketAnalytics)
router.route('/suggest-reply').post(suggestReply);

export default router;