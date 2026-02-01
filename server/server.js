import express from "express";
import connectDB from "./configs/db.js";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.js";
import courseRouter from "./routes/course.js";
import mediaRouter from "./routes/media.js";
import purchaseRouter, { stripeWebhook } from "./routes/purchase.js";
import courseProgress from "./routes/coursePorgress.js";

const app = express();
await connectDB();
const port = 3000;

// ⚡ Stripe webhook route — must be BEFORE express.json()
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }), // raw body for signature verification
  stripeWebhook,
);

// ⚡ Global middlewares
app.use(express.json());
app.use(
  cors({
    origin: "https://lms-6lky.vercel.app",
    credentials: true,
  }),
);
app.use(cookieParser());

// Routes
app.use("/api/user", userRouter);
app.use("/api/progress", courseProgress);
app.use("/api/course", courseRouter);
app.use("/api/media", mediaRouter);
app.use("/api/stripe", purchaseRouter);

app.get("/", (req, res) => {
  res.send("Server is Live!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
