import express from "express";
import connectDB from "./configs/db.js";
import "dotenv/config";
import cors from "cors";

// Import routes
import userRouter from "./routes/user.js";
import courseRouter from "./routes/course.js";
import mediaRouter from "./routes/media.js";
import purchaseRouter, { stripeWebhook } from "./routes/purchase.js";
import courseProgress from "./routes/coursePorgress.js";

const app = express();
await connectDB();
const port = process.env.PORT || 3000;

// ⚡ Stripe webhook route — must be BEFORE express.json()
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }), // raw body for signature verification
  stripeWebhook,
);

// ⚡ Global middlewares
app.use(express.json());

// ⚡ CORS setup for frontend (production + local)
app.use(cors());

// ⚡ Cookie parser not needed anymore
// app.use(cookieParser());

// ⚡ Routes
app.use("/api/user", userRouter);
app.use("/api/progress", courseProgress);
app.use("/api/course", courseRouter);
app.use("/api/media", mediaRouter);
app.use("/api/stripe", purchaseRouter);

// ⚡ Default route
app.get("/", (req, res) => {
  res.send("Server is Live!");
});

// ⚡ Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
