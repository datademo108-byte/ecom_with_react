// const express = require("express");
// const Order = require("../models/Order");
// const authMiddleware = require("../middleware/authMiddleware");
// const router = express.Router();

// // Save order after successful payment
// router.post("/", authMiddleware, async (req, res) => {
//   try {
//     console.log("📦 Received order request body:", JSON.stringify(req.body, null, 2));
//     console.log("👤 User from token:", req.user);

//     const { items, totalAmount, paymentId, orderId, signature } = req.body;

//     // Validate required fields
//     if (!items || !totalAmount || !paymentId || !orderId || !signature) {
//       console.log("❌ Missing fields:", {
//         items: !!items,
//         totalAmount: !!totalAmount,
//         paymentId: !!paymentId,
//         orderId: !!orderId,
//         signature: !!signature
//       });
//       return res.status(400).json({ 
//         success: false, 
//         message: "Missing required order details" 
//       });
//     }

//     // Check if items array is valid
//     if (!Array.isArray(items) || items.length === 0) {
//       console.log("❌ Invalid items array:", items);
//       return res.status(400).json({ 
//         success: false, 
//         message: "Invalid items data" 
//       });
//     }

//     // Check if order already exists
//     const existingOrder = await Order.findOne({ orderId });
//     if (existingOrder) {
//       console.log("❌ Order already exists:", orderId);
//       return res.status(400).json({ 
//         success: false, 
//         message: "Order already exists" 
//       });
//     }

//     // Format items for storage
//     const formattedItems = items.map((item) => ({
//       product: item._id,
//       name: item.name,
//       price: Number(item.price),
//       quantity: Number(item.quantity),
//     }));

//     console.log("📝 Formatted items:", formattedItems);

//     // Create new order with explicit paymentStatus
//     const order = new Order({
//       user: req.user.id,
//       items: formattedItems,
//       totalAmount: Number(totalAmount),
//       paymentId,
//       orderId,
//       signature,
//       paymentStatus: "success", // This will now work with the updated enum
//       orderStatus: "pending",
//     });

//     console.log("💾 Attempting to save order...");
//     const savedOrder = await order.save();
//     console.log("✅ Order saved successfully with ID:", savedOrder._id);

//     res.status(201).json({
//       success: true,
//       message: "Order placed successfully",
//       order: savedOrder,
//     });
//   } catch (error) {
//     console.error("❌ Order save error:", {
//       message: error.message,
//       name: error.name,
//       code: error.code,
//       stack: error.stack
//     });
    
//     // Handle specific MongoDB errors
//     if (error.name === 'ValidationError') {
//       // Extract validation error messages
//       const validationErrors = Object.values(error.errors).map(e => e.message);
//       return res.status(400).json({ 
//         success: false, 
//         error: "Validation error: " + validationErrors.join(', ')
//       });
//     }
    
//     if (error.code === 11000) {
//       return res.status(400).json({ 
//         success: false, 
//         error: "Duplicate order detected" 
//       });
//     }

//     res.status(500).json({ 
//       success: false, 
//       error: error.message 
//     });
//   }
// });

// // Get user orders
// router.get("/my-orders", authMiddleware, async (req, res) => {
//   try {
//     console.log("📦 Fetching orders for user:", req.user.id);
//     const orders = await Order.find({ user: req.user.id })
//       .populate("items.product", "name image price")
//       .sort({ createdAt: -1 });

//     console.log(`✅ Found ${orders.length} orders`);
//     res.json(orders);
//   } catch (error) {
//     console.error("❌ Error fetching orders:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get single order
// router.get("/:orderId", authMiddleware, async (req, res) => {
//   try {
//     const order = await Order.findOne({
//       _id: req.params.orderId,
//       user: req.user.id,
//     }).populate("items.product", "name image price");

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     res.json(order);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Admin: Get all orders
// router.get("/admin/all", authMiddleware, async (req, res) => {
//   try {
//     if (!req.user.isAdmin) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const orders = await Order.find()
//       .populate("user", "name email")
//       .populate("items.product", "name")
//       .sort({ createdAt: -1 });

//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Admin: Update order status
// router.patch("/:orderId/status", authMiddleware, async (req, res) => {
//   try {
//     if (!req.user.isAdmin) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const { orderStatus } = req.body;
//     const order = await Order.findByIdAndUpdate(
//       req.params.orderId,
//       { orderStatus },
//       { new: true }
//     );

//     res.json(order);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;



const express = require("express");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Save order after successful payment
router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("📦 Received order request body:", JSON.stringify(req.body, null, 2));
    console.log("👤 User from token:", req.user);

    const { items, totalAmount, paymentId, orderId, signature } = req.body;

    // Validate required fields
    if (!items || !totalAmount || !paymentId || !orderId || !signature) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required order details" 
      });
    }

    // Check if items array is valid
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid items data" 
      });
    }

    // Check if order already exists
    const existingOrder = await Order.findOne({ orderId });
    if (existingOrder) {
      return res.status(400).json({ 
        success: false, 
        message: "Order already exists" 
      });
    }

    // Format items for storage
    const formattedItems = items.map((item) => ({
      product: item._id,
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity),
    }));

    // Create new order
    const order = new Order({
      user: req.user.id,
      items: formattedItems,
      totalAmount: Number(totalAmount),
      paymentId,
      orderId,
      signature,
      paymentStatus: "success",
      orderStatus: "pending",
    });

    const savedOrder = await order.save();
    console.log("✅ Order saved successfully with ID:", savedOrder._id);

    // Populate user details for response
    await savedOrder.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("❌ Order save error:", error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ 
        success: false, 
        error: "Validation error: " + validationErrors.join(', ')
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get user orders (for regular users) - NOW WITH POPULATE
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    console.log("📦 Fetching orders for user:", req.user.id);
    
    let orders;
    if (req.user.isAdmin) {
      // Admin sees all orders with full user details
      orders = await Order.find()
        .populate("user", "name email")
        .populate("items.product", "name image price")
        .sort({ createdAt: -1 });
    } else {
      // Regular users see only their orders with their user details
      orders = await Order.find({ user: req.user.id })
        .populate("user", "name email") // 👈 THIS IS IMPORTANT - POPULATE USER DATA
        .populate("items.product", "name image price")
        .sort({ createdAt: -1 });
    }

    console.log(`✅ Found ${orders.length} orders`);
    res.json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all orders (admin only)
router.get("/admin/all", authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update order status (admin only)
router.patch("/:orderId/status", authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { orderStatus } = req.body;
    
    // Validate status
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ error: "Invalid order status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { orderStatus },
      { new: true }
    ).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    console.log(`✅ Order ${order.orderId} status updated to ${orderStatus}`);
    res.json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get single order
router.get("/:orderId", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("user", "name email")
      .populate("items.product", "name image price");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user is authorized to view this order
    if (!req.user.isAdmin && order.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;