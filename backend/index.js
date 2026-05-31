const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const path = require('path');

const interviewRoutes = require('./routes/interview');
const forumRoutes = require('./routes/forum');

require('dotenv').config();

require('./config/passport');

const app = express();

app.use(express.json());

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(passport.initialize());
app.use(passport.session());

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

const authRoutes = require('./routes/auth');

app.use('/auth', authRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/forum', forumRoutes);

app.get('/', (req, res) => {
    res.send("AI Mock Interview Platform Backend API running...");
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('*', (req, res) => {
        res.sendFile(
            path.resolve(__dirname, '../frontend', 'dist', 'index.html')
        );
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server initialized smoothly on port ${PORT}`);
});