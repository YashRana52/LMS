import express from "express";
import protect from "../middlewares/auth.js";
import {
  createCheckoutSession,
  stripeWebhook,
} from "../controllers/purchase.js";

const purchaseRouter = express.Router();

purchaseRouter.post(
  "/checkout/create-checkout-session",
  protect,
  createCheckoutSession,
);
purchaseRouter.post("/webhook", stripeWebhook);

export default purchaseRouter;
