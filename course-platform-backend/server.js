const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const PORT = process.env.PORT || 5000;

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Routes

app.use('/api/auth', authRoutes);


app.use('/api/user', userRoutes);

app.use('/api/courses', courseRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));


// Default route
app.get('/', (req, res) => {
  res.send('Backend is working 🎉');
});

// Start the server

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

