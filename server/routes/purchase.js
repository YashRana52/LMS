import express from "express";
import protect from "../middlewares/auth.js";
import {
  createCheckoutSession,
  stripeWebhook as stripeWebhookController,
} from "../controllers/purchase.js";

const purchaseRouter = express.Router();

// Protected checkout session
purchaseRouter.post(
  "/checkout/create-checkout-session",
  protect,
  createCheckoutSession,
);

// ⚡ Export webhook separately for app.js
export const stripeWebhook = stripeWebhookController;

export default purchaseRouter;
