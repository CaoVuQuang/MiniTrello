const express = require("express");
const router = express.Router({ mergeParams: true });
const admin = require("firebase-admin");

const db = admin.firestore();

router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("boards").get();
    const boards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(boards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch boards" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await db.collection("boards").doc(id).get();
    if (!doc.exists) return res.status(404).json({ message: "Board not found" });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch board" });
  }
});

router.post("/", async (req, res) => {
  const { name, description } = req.body;

  try {
    const docRef = await db.collection("boards").add({ name, description });
    res.status(201).json({ id: docRef.id, name, description });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create board" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    await db.collection("boards").doc(id).update({ name, description });
    res.json({ id, name, description });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update board" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.collection("boards").doc(id).delete();
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete board" });
  }
});

module.exports = router;
