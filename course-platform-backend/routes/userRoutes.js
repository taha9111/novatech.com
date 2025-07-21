const express = require('express');
const router = express.Router();
const { updatePhoto } = require("../controllers/userController");
const { getProfile, getMyCourses, enrollUserInCourse, updateProfilePhoto } = require("../controllers/userController");
const authenticate = require("../middleware/authenticate");
const multer = require("multer");
const path = require("path");
const User = require('../models/User');
const Course = require('../models/Course');


// Setup multer for photo upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});
const upload = multer({ storage });

// Routes
router.get("/profile", authenticate, getProfile);
router.get("/my-courses", authenticate, getMyCourses);
router.post("/enroll/:courseId", authenticate, enrollUserInCourse);

// ✅ Add this route for updating the photo
router.put("/update-photo", authenticate, upload.single("photo"), updateProfilePhoto);

router.post('/:userId/buy-course/:courseId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const course = await Course.findById(req.params.courseId);

    if (!user || !course) {
      return res.status(404).json({ message: 'User or course not found' });
    }

    // Prevent duplicates
    if (user.paidCourses.includes(course._id)) {
      return res.status(400).json({ message: 'Course already purchased' });
    }

    user.paidCourses.push(course._id);
    await user.save();

    res.json({ message: '✅ Course added to user profile', courseId: course._id });
  } catch (err) {
    console.error('Purchase error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
