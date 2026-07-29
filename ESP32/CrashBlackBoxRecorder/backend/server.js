const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (temporary)
// Later these will be replaced with MongoDB
let currentStatus = {};
let previousCrash = {};

// ========================================
// Health Check
// ========================================
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        service: "Crash Black Box Backend"
    });
});

// ========================================
// Receive Current Device Status
// ========================================
app.post("/api/device/status", (req, res) => {

    currentStatus = req.body;

    console.clear();

    console.log("========================================");
    console.log("        CURRENT DEVICE STATUS");
    console.log("========================================");
    console.table(currentStatus);

    res.status(200).json({
        success: true,
        message: "Current status received."
    });
});

// ========================================
// Receive Previous Crash Report
// ========================================
app.post("/api/device/previous-crash", (req, res) => {

    previousCrash = req.body;

    console.log("\n");
    console.log("========================================");
    console.log("       PREVIOUS CRASH REPORT");
    console.log("========================================");
    console.table(previousCrash);

    res.status(200).json({
        success: true,
        message: "Crash report received."
    });
});

// ========================================
// Return Latest Current Status
// ========================================
app.get("/api/device/status", (req, res) => {
    res.status(200).json(currentStatus);
});

// ========================================
// Return Previous Crash Report
// ========================================
app.get("/api/device/previous-crash", (req, res) => {
    res.status(200).json(previousCrash);
});

// ========================================
// Start Server
// ========================================
app.listen(PORT, "0.0.0.0", () => {

    console.log("========================================");
    console.log(" Crash Black Box Backend");
    console.log("========================================");
    console.log(`Server Running : http://localhost:${PORT}`);
    console.log(`Network URL    : http://0.0.0.0:${PORT}`);
    console.log("Waiting for ESP32...");
    console.log("========================================");

});