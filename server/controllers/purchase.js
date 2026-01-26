import Stripe from "stripe";
import { Course } from "../models/course.js";
import { CoursePurchase } from "../models/purchase.js";
import { Lecture } from "../models/lecture.js";
import User from "../models/user.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }

    //  Prevent duplicate purchase
    const existingPurchase = await CoursePurchase.findOne({
      userId,
      courseId,
      status: { $in: ["pending", "completed"] },
    });

    if (existingPurchase) {
      return res.status(400).json({
        message: "Course already purchased or payment in progress",
      });
    }

    // Create DB record first
    const newPurchase = await CoursePurchase.create({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
    });

    //  Stripe checkout
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseTitle,
              images: course.courseThumbnail ? [course.courseThumbnail] : [],
            },
            unit_amount: course.coursePrice * 100,
          },
          quantity: 1,
        },
      ],

      success_url: `http://localhost:5173/course-progress/${courseId}`,
      cancel_url: `http://localhost:5173/course-detail/${courseId}`,

      metadata: {
        purchaseId: newPurchase._id.toString(),
        courseId: courseId.toString(),
        userId: userId.toString(),
      },
    });

    //  Save session id
    newPurchase.paymentId = session.id;
    await newPurchase.save();

    return res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const stripeWebhook = async (req, res) => {
  let event;

  // 🔐 STEP 1: Verify real Stripe webhook
  try {
    const sig = req.headers["stripe-signature"];

    event = stripe.webhooks.constructEvent(
      req.body, // raw body
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("Webhook verification failed:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    //  STEP 2: Handle events
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;

        // Checkout session fetch
        const sessions = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });

        const session = sessions.data[0];
        if (!session) break;

        const purchase = await CoursePurchase.findOne({
          paymentId: session.id,
        }).populate("courseId");

        if (!purchase || purchase.status === "completed") {
          break; // already processed
        }

        // amount
        purchase.amount = paymentIntent.amount_received / 100;
        purchase.status = "completed";
        await purchase.save();

        // 🔓 Unlock lectures
        if (purchase.courseId?.lectures?.length > 0) {
          await Lecture.updateMany(
            { _id: { $in: purchase.courseId.lectures } },
            { $set: { isPreviewFree: true } },
          );
        }

        // 👤 Add course to user
        await User.findByIdAndUpdate(purchase.userId, {
          $addToSet: { enrolledCourses: purchase.courseId._id },
        });

        // 🎓 Add student to course
        await Course.findByIdAndUpdate(purchase.courseId._id, {
          $addToSet: { enrolledStudents: purchase.userId },
        });

        console.log("✅ payment_intent.succeeded processed");
        break;
      }

      /**
       *  PAYMENT CANCELED
       */
      case "payment_intent.canceled": {
        const paymentIntent = event.data.object;

        const sessions = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });

        const session = sessions.data[0];
        if (!session) break;

        await CoursePurchase.findOneAndUpdate(
          { paymentId: session.id },
          { status: "canceled" },
        );

        console.log("❌ payment_intent.canceled processed");
        break;
      }

      default:
        console.log("Unhandled event:", event.type);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
