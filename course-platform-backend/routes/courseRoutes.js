const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // adjust path if different
const Course = require('../models/Course'); // adjust path if different
const authenticate = require('../middleware/authenticate'); // JWT middleware

// Enroll in free course
router.post('/free/:id', authenticate, async (req, res) => {
  try {
    const courseId = req.params.id;
    const user = await User.findById(req.user.userId);

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Prevent duplicate enrollment
    if (user.courses.includes(courseId)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    user.courses.push(courseId);
    await user.save();

    res.json({ message: 'Enrolled successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
