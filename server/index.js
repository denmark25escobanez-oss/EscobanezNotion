require("dotenv").config();
const express = require("express");
const { connectToMongoDB } = require("./database");
const path = require('path');

const app = express();
app.use(express.json());

// 1. API Routes
const router = require("./routes");
app.use("/api", router);

// 2. Static Files - Flexible Path
const buildPath = path.resolve(__dirname, "../client/dist"); 
// Note: If your React build folder is called 'build', change 'dist' to 'build' above.
app.use(express.static(buildPath));

// 3. Simple Catch-All
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

const port = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectToMongoDB();
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (err) {
        console.error("DB Connection Error:", err);
    }
};

startServer();