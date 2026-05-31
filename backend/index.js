require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const helmet = require('helmet'); // Added for security headers

// Import Routes
const interviewRoutes = require('./routes/interview');
const forumRoutes = require('./routes/forum');
const authRoutes = require('./routes/auth');

// Initialize Passport Config
require('./config/passport');

const app = express();

// --- Security & Middleware Layer ---
app.use(helmet({
    contentSecurityPolicy: false, // Set to true if not using external CDNs
}));

app.use(express.json({ limit: '10mb' })); // Allows larger JSON payloads (e.g., code snippets)
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true in production
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 Hours
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("████████████████████████████████");
        console.log("✅ MongoDB Atlas Connected Successfully!");
        console.log("████████████████████████████████");
    })
    .catch((err) => {
        console.error("❌ MongoDB Connection Failure:", err.message);
        process.exit(1); // Stop server if DB is unreachable
    });

// --- API Route Definitions ---
app.use('/auth', authRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/forum', forumRoutes);

// --- Health Check ---
app.get('/health', (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date() });
});

// --- Production Frontend Serving ---
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
    });
}

// --- Global Error Handler ---
app.use((err, req, res, next) => {
    console.error("❌ GLOBAL ERROR LOG:", err.stack);
    res.status(500).json({ 
        success: false, 
        message: "Internal Server Error. Please contact cluster admin." 
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server initialized smoothly on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});