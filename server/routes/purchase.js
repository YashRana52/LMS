import express from "express";
import protect from "../middlewares/auth.js";

const purchaseRouter = express.Router();

purchaseRouter.post(
  "/checkout/create-checkout-session",
  protect,
  createCheckoutSession,
);

export default purchaseRouter;
