import express from "express";
import protect from "../middlewares/auth.js";
import {
  createCheckoutSession,
  stripeWebhook,
} from "../controllers/purchase.js";

const purchaseRouter = express.Router();

//  Create Checkout session (protected)
purchaseRouter.post(
  "/checkout/create-checkout-session",
  protect,
  createCheckoutSession,
);

// ⚡ Webhook route (public, raw body already handled in app.js)
purchaseRouter.post("/webhook", stripeWebhook);

export default purchaseRouter;
