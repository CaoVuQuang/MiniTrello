const express = require("express");
const router = express.Router({ mergeParams: true });
const admin = require("firebase-admin");

const db = admin.firestore();

router.post("/", async (req, res) => {
  const { boardId, cardId, taskId } = req.params;
  const { memberId } = req.body;

  try {
    await db.collection("boards")
      .doc(boardId)
      .collection("cards")
      .doc(cardId)
      .collection("tasks")
      .doc(taskId)
      .collection("assignments")
      .doc(memberId)
      .set({ memberId, assignedAt: new Date() });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to assign member" });
  }
});

router.get("/", async (req, res) => {
  const { boardId, cardId, taskId } = req.params;

  try {
    const snapshot = await db.collection("boards")
      .doc(boardId)
      .collection("cards")
      .doc(cardId)
      .collection("tasks")
      .doc(taskId)
      .collection("assignments")
      .get();

    const assignments = snapshot.docs.map(doc => doc.id);
    res.json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
});
router.delete("/:memberId", async (req, res) => {
  const { taskId, memberId } = req.params;

  try {
    const taskRef = db.collection("tasks").doc(taskId);
    const task = await taskRef.get();
    const data = task.data();

    const updated = (data.assigned || []).filter(m => m !== memberId);
    await taskRef.update({ assigned: updated });

    res.json({ success: true, assigned: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to unassign member" });
  }
});

module.exports = router;
