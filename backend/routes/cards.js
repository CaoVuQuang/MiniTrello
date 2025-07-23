const express = require("express");
const router = express.Router({ mergeParams: true });
const admin = require("firebase-admin");

const db = admin.firestore();

router.get("/", async (req, res) => {
  const { boardId } = req.params;
  try {
    const snapshot = await db.collection("cards").where("boardId", "==", boardId).get();
    const cards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(cards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cards" });
  }
});

router.get("/:id", async (req, res) => {
  const { boardId, id } = req.params;
  try {
    const doc = await db.collection("cards").doc(id).get();
    if (!doc.exists) return res.status(404).json({ message: "Card not found" });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch card" });
  }
});

router.post("/", async (req, res) => {
  const { boardId } = req.params;
  const { title, description = "", listId } = req.body;

  try {
    const docRef = await db.collection("cards").add({ boardId, title, description, listId });
    res.status(201).json({ id: docRef.id, boardId, title, description, listId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create card" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, listId } = req.body;

  try {
    await db.collection("cards").doc(id).update({ title, description, listId });
    res.json({ id, title, description, listId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update card" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.collection("cards").doc(id).delete();
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete card" });
  }
});

module.exports = router;
