const express = require("express");
const router = express.Router({ mergeParams: true });
const admin = require("firebase-admin");

const db = admin.firestore();

router.post("/", async (req, res) => {
  const { boardId } = req.params;
  const { memberId, email_member, status = "pending" } = req.body;

  if (!memberId || !email_member) {
    return res.status(400).json({ error: "memberId and email_member are required" });
  }

  try {
    await db
      .collection("boards")
      .doc(boardId)
      .collection("members")
      .doc(memberId)
      .set({
        memberId,
        email_member,
        status,
        invitedAt: new Date(),
      });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to invite member" });
  }
});

router.get("/", async (req, res) => {
  const { boardId } = req.params;

  try {
    const snapshot = await db
      .collection("boards")
      .doc(boardId)
      .collection("members")
      .get();

    const members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch members" });
  }
});

module.exports = router;
