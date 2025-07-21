const User = require('../models/User');
const Course = require('../models/Course');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



// ==============================
// LOGIN CONTROLLER
// ==============================
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", { email, password });

  if (!email || !password) {
    console.log("Missing fields");
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(401).json({ message: "User not found" });
    }

    console.log("Found user:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for user:", email);
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    console.log("Login successful for:", email);
    res.json({ token, userId: user._id });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Error logging in" });
  }
};

// ==============================
// REGISTER CONTROLLER (with photo)
// ==============================
exports.register = async (req, res) => {
  try {
    const { name, age, email, password } = req.body;
    const photo = req.file ? req.file.filename : null;

    if (!name || !age || !email || !password || !photo) {
      return res.status(400).json({ message: "All fields including photo are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      age,
      email,
      password: hashedPassword,
      photo,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ message: "Error registering user" });
  }
};