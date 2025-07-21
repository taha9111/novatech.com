const User = require('../models/User');
const Course = require('../models/Course');
const mongoose = require('mongoose');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

exports.getMyCourses = async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId).populate("paidCourses");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ courses: user.paidCourses });
  } catch (err) {
    res.status(500).json({ message: "Error fetching courses" });
  }
};
exports.updateProfilePhoto = async (req, res) => {
  try {
    const userId = req.user.userId;
    const photo = req.file ? req.file.filename : null;

    if (!photo) {
      return res.status(400).json({ message: "No photo uploaded" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.photo = photo;
    await user.save();

    res.status(200).json({ message: "Profile photo updated successfully", photo });
  } catch (error) {
    console.error("Photo update error:", error);
    res.status(500).json({ message: "Error updating photo" });
  }
};



exports.enrollUserInCourse = async (req, res) => {
  try {
    const userId = req.user.userId;
    const courseId = req.params.courseId;

    console.log("Course ID:", courseId);
    console.log("Decoded userId:", userId);

    const user = await User.findById(userId).populate('paidCourses');
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(404).json({ message: "User or course not found" });
    }

    // ✅ Prevent enrolling in the same course multiple times
    const alreadyEnrolled = user.paidCourses.some(c => c._id.toString() === courseId);
    if (alreadyEnrolled) {
      return res.status(400).json({ message: "You are already enrolled in this course." });
    }

    user.paidCourses.push(course._id); // safer to use course._id
    await user.save();

    res.status(200).json({ message: "Course enrolled successfully" });
  } catch (err) {
    console.error("Enrollment error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


