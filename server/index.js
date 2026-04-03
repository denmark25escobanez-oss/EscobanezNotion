require("dotenv").config();
const express = require("express");
const { connectToMongoDB } = require("./database");
const path = require("path");

const app = express();
app.use(express.json());

// Serve frontend build from client/dist
const frontendPath = path.resolve(__dirname, "../client/dist");
app.use(express.static(frontendPath));

// API routes
const router = require("./routes");
app.use("/api", router);

// Catch-all route to serve index.html for SPA
app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

const port = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectToMongoDB();
        app.listen(port, () => {
            console.log(`Server is listening on http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
    }
};

startServer();