const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const admin = require("../firebaseConfig"); // Firebase Admin SDK for token verification
const pool = require("../database"); // PostgreSQL database connection
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; // Use an environment variable

// User Registration API
router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Check if the user already exists
        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user
        const newUser = await pool.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
            [email, hashedPassword]
        );

        // Generate JWT token
        const token = jwt.sign({ id: newUser.rows[0].id, email }, JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: newUser.rows[0],
        });
    } catch (error) {
        console.error("Error registering user:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

// User Login API
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Check if user exists
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.rows[0].id, email }, JWT_SECRET, { expiresIn: "7d" });

        res.json({ message: "Login successful", token, user: { id: user.rows[0].id, email } });
    } catch (error) {
        console.error("Error logging in:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

// Verify Firebase Auth Token
router.post("/verifyToken", async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ message: "Token is required" });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        res.json({ message: "Token is valid", decodedToken });
    } catch (error) {
        console.error("Error verifying token:", error.message);
        res.status(401).json({ message: "Invalid token" });
    }
});

module.exports = router;
