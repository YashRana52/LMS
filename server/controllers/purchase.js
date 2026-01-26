import Stripe from "stripe";
import { Course } from "../models/course.js";
import { CoursePurchase } from "../models/purchase.js";
import User from "../models/user.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ========================
// Create Stripe Checkout
// ========================
export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    console.log(
      `[Checkout] User ${userId} initiating checkout for course ${courseId}`,
    );

    const course = await Course.findById(courseId);
    if (!course) {
      console.log(`[Checkout] Course ${courseId} not found`);
      return res.status(404).json({ message: "Course not found!" });
    }

    // Prevent duplicate purchase
    const existingPurchase = await CoursePurchase.findOne({
      userId,
      courseId,
      status: { $in: ["pending", "completed"] },
    });

    if (existingPurchase) {
      console.log(`[Checkout] Duplicate purchase attempt by user ${userId}`);
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

    console.log(`[Checkout] Created purchase record: ${newPurchase._id}`);

    // Stripe checkout session
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

    // Save Stripe session id
    newPurchase.paymentId = session.id;
    await newPurchase.save();

    console.log(`[Checkout] Stripe session created: ${session.id}`);

    return res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error("[Checkout] Stripe checkout error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ========================
// Stripe Webhook
// ========================
export const stripeWebhook = async (req, res) => {
  let event;

  // Step 1: Verify Stripe signature
  try {
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
    console.log("[Webhook] Event verified:", event.type);
  } catch (error) {
    console.error("[Webhook] Signature verification failed:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        console.log(
          "[Webhook] checkout.session.completed received:",
          session.id,
        );

        const purchaseId = session.metadata?.purchaseId;
        if (!purchaseId) {
          console.warn("[Webhook] No purchaseId in metadata");
          break;
        }

        const purchase =
          await CoursePurchase.findById(purchaseId).populate("courseId");
        if (!purchase) {
          console.warn(`[Webhook] Purchase not found: ${purchaseId}`);
          break;
        }
        if (purchase.status === "completed") {
          console.log(`[Webhook] Purchase already completed: ${purchaseId}`);
          break;
        }

        // ✅ Update purchase status
        purchase.status = "completed";
        purchase.amount = session.amount_total / 100;
        await purchase.save();

        // ✅ Add course to user
        await User.findByIdAndUpdate(purchase.userId, {
          $addToSet: { enrolledCourses: purchase.courseId._id },
        });

        // ✅ Add student to course
        await Course.findByIdAndUpdate(purchase.courseId._id, {
          $addToSet: { enrolledStudents: purchase.userId },
        });

        console.log(
          `[Webhook] Purchase completed and DB updated: ${purchaseId}`,
        );
        break;
      }

      case "payment_intent.succeeded": {
        console.log(
          "[Webhook] payment_intent.succeeded received:",
          event.data.object.id,
        );
        // Optional: You can handle this too, but checkout.session.completed is preferred for metadata
        break;
      }

      case "payment_intent.canceled": {
        const paymentIntent = event.data.object;
        const purchaseId = paymentIntent.metadata?.purchaseId;
        if (!purchaseId) break;

        await CoursePurchase.findByIdAndUpdate(purchaseId, {
          status: "canceled",
        });
        console.log(`[Webhook] Payment canceled for purchase: ${purchaseId}`);
        break;
      }

      default:
        console.log("[Webhook] Unhandled event type:", event.type);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("[Webhook] Processing error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
