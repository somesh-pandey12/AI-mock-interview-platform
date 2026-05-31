const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("████████████████████████████████\n✅ MongoDB Atlas Connected Successfully!\n████████████████████████████████"))
    .catch((err) => {
        console.error("❌ MongoDB Connection Failure!");
        console.error(err);
    });

// Basic Test Route
app.get('/', (req, res) => {
    res.send("AI Mock Interview Platform Backend API running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server initialized smoothly on port ${PORT}`);
});