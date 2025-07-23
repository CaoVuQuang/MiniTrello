const express = require("express");
const router = express.Router({ mergeParams: true });
const admin = require("firebase-admin");

const db = admin.firestore();

router.get("/", async (req, res) => {
  const { boardId, cardId } = req.params;

  try {
    const snapshot = await db
      .collection("tasks")
      .where("boardId", "==", boardId)
      .where("cardId", "==", cardId)
      .get();

    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

router.get("/:taskId", async (req, res) => {
  const { taskId } = req.params;

  try {
    const doc = await db.collection("tasks").doc(taskId).get();
    if (!doc.exists) return res.status(404).json({ message: "Task not found" });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

router.post("/", async (req, res) => {
  const { boardId, cardId } = req.params;
  const { title, status = "todo", description = "" } = req.body;

  try {
    const docRef = await db.collection("tasks").add({ boardId, cardId, title, status, description });
    res.status(201).json({ id: docRef.id, boardId, cardId, title, status, description });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create task" });
  }
});

router.put("/:taskId", async (req, res) => {
  const { taskId } = req.params;
  const updatedData = req.body;

  try {
    await db.collection("tasks").doc(taskId).update(updatedData);
    res.json({ id: taskId, ...updatedData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update task" });
  }
});

router.delete("/:taskId", async (req, res) => {
  const { taskId } = req.params;

  try {
    await db.collection("tasks").doc(taskId).delete();
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;
