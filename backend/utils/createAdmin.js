const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ isAdmin: true });

    if (adminExists) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = new User({
      name: "Super Admin",
      email: "admin@mobitrail.com",
      password: hashedPassword,
      isAdmin: true,
    });

    await admin.save();
    console.log("Admin created successfully");
  } catch (error) {
    console.error("Admin creation error:", error.message);
  }
};

module.exports = createAdmin;
