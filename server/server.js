import express from "express";
import connectDB from "./configs/db.js";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.js";
import courseRouter from "./routes/course.js";
import mediaRouter from "./routes/media.js";
import purchaseRouter from "./routes/purchase.js";

const app = express();
await connectDB();
const port = 3000;

app.use("/api/stripe/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server is Live!");
});

app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/media", mediaRouter);
app.use("/api/stripe", purchaseRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
