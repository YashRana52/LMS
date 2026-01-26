import express from "express";
import protect from "../middlewares/auth.js";
import { createCheckoutSession } from "../controllers/purchase.js";

const purchaseRouter = express.Router();

purchaseRouter.post(
  "/checkout/create-checkout-session",
  protect,
  createCheckoutSession,
);

export default purchaseRouter;
