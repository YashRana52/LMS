import Stripe from "stripe";
import { Course } from "../models/course.js";
import { CoursePurchase } from "../models/purchase.js";
import User from "../models/user.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Check for existing pending/completed purchase
    let existingPurchase = await CoursePurchase.findOne({
      userId,
      courseId,
      status: { $in: ["pending", "completed"] },
    });

    if (existingPurchase) {
      if (existingPurchase.status === "pending" && existingPurchase.paymentId) {
        // allow user to pay the same pending session
        return res.status(200).json({
          url: `https://checkout.stripe.com/pay/${existingPurchase.paymentId}`,
        });
      }
      return res.status(400).json({ message: "Course already purchased" });
    }

    // Create new purchase
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
            product_data: { name: course.courseTitle },
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

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.WEBHOOK_ENDPOINT_SECRET,
    );
  } catch (err) {
    console.error("❌ Webhook signature failed:", err.message);
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

        await User.findByIdAndUpdate(purchase.userId, {
          $addToSet: { enrolledCourses: purchase.courseId },
        });

        await Course.findByIdAndUpdate(purchase.courseId, {
          $addToSet: { enrolledStudents: purchase.userId },
        });

        console.log("✅ Payment verified & course unlocked");
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object;
        const purchaseId = session.metadata?.purchaseId;
        if (purchaseId) {
          await CoursePurchase.findByIdAndUpdate(purchaseId, {
            status: "failed",
          });
        }
        break;
      }

      default:
        console.log("Unhandled event:", event.type);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    res.json({ received: true });
  }
};

export const getCourseDetailsWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;
    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });
    const purchased = await CoursePurchase.findOne({ userId, courseId });

    if (!course) {
      return res.status(404).json({
        message: "course not found",
      });
    }
    return res.status(200).json({
      course,
      purchased: purchased ? true : false,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPurchasedCourse = async (_, res) => {
  try {
    const purchasedCourse = await CoursePurchase.find({
      status: "completed",
    }).populate("courseId");

    if (!purchasedCourse) {
      return res.status(404).json({
        purchasedCourse: [],
      });
    }
    return res.status(200).json({
      purchasedCourse,
    });
  } catch (error) {
    console.log(error);
  }
};
