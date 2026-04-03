require("dotenv").config();
const express = require("express");
const { connectToMongoDB } = require("./database");
const path = require('path');

const app = express();
app.use(express.json());

// API Routes FIRST
const router = require("./routes");
app.use("/api", router);

// Static files SECOND
// Check if 'build' folder exists; if not, use current directory
const buildPath = path.join(__dirname, 'build');
app.use(express.static(buildPath));

// The "Catch-All" for React Router - FIXING THE WILDCARD ERROR
// Instead of '*', we use a regex that matches everything safely
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

const port = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectToMongoDB();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (err) {
        console.error("DB Connection Error:", err);
    }
};

startServer();