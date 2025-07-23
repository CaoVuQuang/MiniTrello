const express = require("express");
const router = express.Router({ mergeParams: true });
const axios = require("axios");

const CLIENT_ID = "Ov23liubn83zpNGOsUNq";
const CLIENT_SECRET = "53bdfc41d668cef4ac13ff55613bd11f0af9390e";

router.get("/repositories/:repositoryId/github-info", (req, res) => {
  const { repositoryId } = req.params;
  res.json({ repositoryId, name: "demo-repo", owner: "demo-user" });
});

router.post("/boards/:boardId/cards/:cardId/tasks/:taskId/github-attach", (req, res) => {
  const { type, number } = req.body;
  res.json({ success: true, attached: { type, number } });
});

router.get("/boards/:boardId/cards/:cardId/tasks/:taskId/github-attachments", (req, res) => {
  res.json([{ id: 1, type: "commit", number: "abc123" }]);
});

router.delete("/boards/:boardId/cards/:cardId/tasks/:taskId/github-attachments/:attachmentId", (req, res) => {
  res.status(204).send();
});
router.get("/start", (req, res) => {
  const redirect_uri = "http://localhost:3001/auth/github/callback";
  const githubUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirect_uri}&scope=user`;
  res.redirect(githubUrl);
});

router.get("/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const tokenRes = await axios.post(`https://github.com/login/oauth/access_token`, {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
    }, {
      headers: { accept: "application/json" }
    });
    res.json({ access_token: tokenRes.data.access_token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "GitHub OAuth failed" });
  }
});
module.exports = router;
