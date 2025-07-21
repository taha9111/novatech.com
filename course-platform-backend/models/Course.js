const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  content: String, // e.g. URL or HTML content
  price: Number
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
