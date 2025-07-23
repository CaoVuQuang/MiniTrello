const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { randomInt } = require("crypto");

const serviceAccount = require("./serviceAccountKey.json");

const app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(cors());
app.use(bodyParser.json());

app.use("/auth/github", require("./routes/github"));
app.use("/boards/:boardId/cards", require("./routes/cards"));
app.use("/boards/:boardId/cards/:cardId/tasks", require("./routes/tasks"));
app.use("/boards/:boardId/cards/:cardId/invite/accept", require("./routes/invites"));
app.use("/boards/:boardId/cards/:cardId/tasks/:taskId/assign", require("./routes/assignments"));



const users = {};
const JWT_SECRET = "your_jwt_secret";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "quangvu120401@gmail.com",
    pass: "xvkk idka loav wgcd",
  },
});

app.post("/auth/signup", async (req, res) => {
  const { email } = req.body;

  const code = String(randomInt(100000, 999999));
  const expiresAt = Date.now() + 10 * 60 * 1000;

  users[email] = { code, expiresAt };

  try {
    await transporter.sendMail({
      from: "quangvu120401@gmail.com",
      to: email,
      subject: "Your verification code",
      text: `Your code is: ${code}`,
    });

    res.json({ message: "Code sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.post("/auth/signin", (req, res) => {
  const { email, verificationCode } = req.body;
  const user = users[email];

  if (
    !user ||
    user.code !== verificationCode ||
    user.expiresAt < Date.now()
  ) {
    return res.status(400).json({ error: "Invalid email or code" });
  }

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ accessToken: token });
});

app.use("/users", require("./routes/users"));
app.use("/boards", require("./routes/boards"));
app.use("/boards/:boardId/members", require("./routes/members"));
app.use("/", require("./routes/github"));
app.use("/boards/:boardId/cards/:cardId/invite/accept", require("./routes/invites"));
app.use("/boards/:boardId/cards/:cardId/tasks/:taskId/assign", require("./routes/assignments"));

app.listen(3001, () => {
  console.log("Backend listening on port 3001");
});
