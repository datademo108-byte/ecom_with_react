const express = require("express");
const Product = require("../models/Product");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

/* =======================
   GET ALL PRODUCTS (PUBLIC)
======================= */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

/* =======================
   ADD PRODUCT (ADMIN)
======================= */
router.post("/", auth, admin, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ message: "Failed to add product" });
  }
});

/* =======================
   UPDATE PRODUCT (ADMIN)
======================= */
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to update product" });
  }
});

/* =======================
   DELETE PRODUCT (ADMIN)
======================= */
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product" });
  }
});

module.exports = router;
