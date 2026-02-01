import express from "express";
import protect from "../middlewares/auth.js";
import {
  createCheckoutSession,
  getAllPurchasedCourse,
  getCourseDetailsWithPurchaseStatus,
  stripeWebhook as stripeWebhookController,
} from "../controllers/purchase.js";

const purchaseRouter = express.Router();

// Protected checkout session
purchaseRouter.post(
  "/checkout/create-checkout-session",
  protect,
  createCheckoutSession,
);

purchaseRouter.get(
  "/course/:courseId/details-with-status",
  protect,
  getCourseDetailsWithPurchaseStatus,
);
purchaseRouter.get("/", getAllPurchasedCourse);

export const stripeWebhook = stripeWebhookController;

export default purchaseRouter;
