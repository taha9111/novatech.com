const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: { type: String, unique: true },
  password: String,
  photo: String,
  paidCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }], // ✅ Add this
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
