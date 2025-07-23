const express = require("express");
const router = express.Router({ mergeParams: true });
const admin = require("firebase-admin");

const db = admin.firestore();

router.post("/", async (req, res) => {
  const { boardId, cardId } = req.params;
  const { memberId, accept } = req.body;

  if (!memberId) {
    return res.status(400).json({ error: "memberId is required" });
  }

  try {
    const status = accept ? "accepted" : "rejected";

    await db
      .collection("boards")
      .doc(boardId)
      .collection("members")
      .doc(memberId)
      .update({ status });

    res.json({ success: true, status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update invite status" });
  }
});

module.exports = router;
