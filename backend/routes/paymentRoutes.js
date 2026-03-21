const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Initialize Razorpay with error handling
let razorpay;
try {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  console.log("Razorpay initialized successfully");
} catch (error) {
  console.error("Razorpay initialization error:", error);
}

// Create order
router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        error: "Invalid amount. Amount must be greater than 0" 
      });
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paise and ensure integer
      currency: "INR",
      receipt: "order_rcptid_" + Date.now(),
      payment_capture: 1, // Auto capture payment
    };

    console.log("Creating Razorpay order with options:", options);

    const order = await razorpay.orders.create(options);
    console.log("Razorpay order created:", order);

    res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay order creation error:", {
      message: error.message,
      stack: error.stack,
      error: error.error // Razorpay specific error
    });

    // Handle Razorpay specific errors
    if (error.error && error.error.description) {
      return res.status(400).json({ 
        error: error.error.description 
      });
    }

    res.status(500).json({ 
      error: "Failed to create payment order. Please try again." 
    });
  }
});

// Verify payment signature
router.post("/verify-payment", authMiddleware, (req, res) => {
  try {
    const { order_id, payment_id, signature } = req.body;

    // Validate required fields
    if (!order_id || !payment_id || !signature) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required payment details" 
      });
    }

    const body = order_id + "|" + payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    console.log("Signature verification:", {
      order_id,
      payment_id,
      expectedSignature,
      receivedSignature: signature
    });

    if (expectedSignature === signature) {
      res.json({ 
        success: true, 
        message: "Payment verified successfully" 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: "Invalid signature" 
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get payment details (optional - for debugging)
router.post("/payment-details", authMiddleware, async (req, res) => {
  try {
    const { payment_id } = req.body;
    
    if (!payment_id) {
      return res.status(400).json({ error: "Payment ID is required" });
    }

    const payment = await razorpay.payments.fetch(payment_id);
    res.json(payment);
  } catch (error) {
    console.error("Error fetching payment details:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;