const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const users = [
  { name: "ten1", email: "ten1@gmail.com", role: "member" },
  { name: "ten2", email: "ten2@gmail.com", role: "admin" },
  { name: "ten3", email: "ten3@gmail.com", role: "member" },
];

users.forEach(async (user) => {
  await db.collection("users").add(user);
});

console.log("Seeded users.");
