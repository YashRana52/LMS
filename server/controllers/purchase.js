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

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Check for existing pending or completed purchase
    let existingPurchase = await CoursePurchase.findOne({
      userId,
      courseId,
      status: { $in: ["pending", "completed"] },
    });

    if (existingPurchase) {
      // If pending purchase exists, allow using same session
      if (existingPurchase.status === "pending" && existingPurchase.paymentId) {
        return res
          .status(200)
          .json({
            url: `https://checkout.stripe.com/pay/${existingPurchase.paymentId}`,
          });
      }
      return res.status(400).json({ message: "Course already purchased" });
    }

    // Create new purchase record
    const newPurchase = await CoursePurchase.create({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseTitle,
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
        courseId: course._id.toString(),
        userId,
      },
    });

    newPurchase.paymentId = session.id;
    await newPurchase.save();

    return res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    console.error("[Checkout] Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ========================
// Stripe Webhook
// ========================
export const stripeWebhook = async (req, res) => {
  let event;

  try {
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("[Webhook] Signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const purchaseId = session.metadata?.purchaseId;

        if (!purchaseId) break;

        const purchase = await CoursePurchase.findById(purchaseId);
        if (!purchase || purchase.status === "completed") break;

        purchase.status = "completed";
        purchase.amount = session.amount_total / 100;
        await purchase.save();

        // Enroll user in course
        await User.findByIdAndUpdate(purchase.userId, {
          $addToSet: { enrolledCourses: purchase.courseId },
        });

        await Course.findByIdAndUpdate(purchase.courseId, {
          $addToSet: { enrolledStudents: purchase.userId },
        });

        console.log(`[Webhook] Purchase completed: ${purchaseId}`);
        break;
      }

      default:
        console.log("[Webhook] Unhandled event type:", event.type);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("[Webhook] Processing error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
