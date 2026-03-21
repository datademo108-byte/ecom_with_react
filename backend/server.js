// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// // Routes
// const authRoutes = require("./routes/authRoutes");
// const productRoutes = require("./routes/productRoutes");
// const paymentRoutes = require("./routes/paymentRoutes");

// // Utils
// const createAdmin = require("./utils/createAdmin");

// const app = express();

// // Middlewares
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDB connected");

//     // ✅ AUTO CREATE ADMIN (ONLY IF NOT EXISTS)
//     createAdmin();
//   })
//   .catch((err) => {
//     console.error("MongoDB connection error:", err.message);
//   });

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/payment", paymentRoutes);

// // Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const orderRoutes = require("./routes/orderRoutes"); // ✅ Add this

// Utils
const createAdmin = require("./utils/createAdmin");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    // ✅ AUTO CREATE ADMIN (ONLY IF NOT EXISTS)
    createAdmin();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes); // ✅ Add this

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});