import express from "express";

import authenticate from "../middlewares/authMiddleware.js";
import { createPayment, adminAction, superConfirm }  from "../controllers/paymentController.js"
import requireRole from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post('/', authenticate, createPayment);
router.post('/:id/admin', authenticate, requireRole('admin'), adminAction);
router.post('/:id/super', authenticate, requireRole('super_admin'), superConfirm);

export default router
