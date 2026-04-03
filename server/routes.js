const express = require("express");
const router = express.Router();
const { getCollection } = require("./models/index");
const { ObjectId } = require("mongodb");

// GET /todos
router.get("/todos", async (req, res) => {
    try {
        const collection = getCollection();
        const todos = await collection.find({}).toArray();
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch todos" });
    }
});

// POST /todos
router.post("/todos", async (req, res) => {
    try {
        const collection = getCollection();
        const { todo } = req.body; 

        if (!todo) {
            return res.status(400).json({ mssg: "Todo text is required" });
        }

        const newTodo = await collection.insertOne({ todo, status: false });
        res.status(201).json({ todo, status: false, _id: newTodo.insertedId });
    } catch (error) {
        res.status(500).json({ error: "Failed to create todo" });
    }
});

// DELETE /todos/:id
router.delete("/todos/:id", async (req, res) => {
    try {
        const collection = getCollection();
        const _id = new ObjectId(req.params.id);
        const deletedTodo = await collection.deleteOne({ _id });
        res.status(200).json(deletedTodo);
    } catch (error) {
        res.status(400).json({ error: "Invalid ID format" });
    }
});

// PUT /todos/:id
router.put("/todos/:id", async (req, res) => {
    try {
        const collection = getCollection();
        const _id = new ObjectId(req.params.id);
        const { status } = req.body;

        if (typeof status !== "boolean") {
            return res.status(400).json({ mssg: "invalid status" });
        }

        const updatedTodo = await collection.updateOne(
            { _id }, 
            { $set: { status: !status } }
        );
        res.status(200).json(updatedTodo);
    } catch (error) {
        res.status(400).json({ error: "Update failed" });
    }
});

// CATCH-ALL ROUTE (Corrected Syntax for Render/Node 22)
router.get("*", (req, res) => {
    res.status(404).json({ mssg: "API route not found" });
});

module.exports = router;