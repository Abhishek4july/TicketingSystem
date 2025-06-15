import { Router } from "express";
import { priorityValues, statusOptions } from "../controllers/options.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router()

router.route('/priority').get(priorityValues)

router.route('/statusOptions').get(statusOptions)

export default router