const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const interviewRoutes = require('./routes/interview');
require('dotenv').config();

// Load Passport Configuration
require('./config/passport');

const app = express();

// Middleware
app.use(express.json());

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true // Allow cookies/auth session sharing
}));

// Session Setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Change to true when using HTTPS in production
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());


// MongoDB Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("████████████████████████████████");
        console.log("✅ MongoDB Atlas Connected Successfully!");
        console.log("████████████████████████████████");
    })
    .catch((err) => {
        console.error("❌ MongoDB Connection Failure!");
        console.error(err);
    });

// Import and Use Routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);
app.use('/api/interview', interviewRoutes);

// Basic Test Route
app.get('/', (req, res) => {
    res.send("AI Mock Interview Platform Backend API running...");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server initialized smoothly on port ${PORT}`);
});