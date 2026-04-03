require("dotenv").config();
const express = require("express");
const { connectToMongoDB } = require("./database");
const path = require('path');

const app = express();
app.use(express.json());

// FIXED: Points to 'dist' and goes up one level to find the 'client' folder
app.use(express.static(path.join(__dirname, '../client/dist')));

const router = require("./routes");
app.use("/api", router);

// FIXED: Catch-all route to serve the frontend on deployment
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const port = process.env.PORT || 5000;

const startServer = async () => {
    await connectToMongoDB();
    app.listen(port, () => {
        console.log(`Server is listening on http://localhost:${port}`);
    });
};

startServer();