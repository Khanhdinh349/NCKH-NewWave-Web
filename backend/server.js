const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Route demo
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from local Express 👋" });
});

app.post("/api/auth", (req, res) => {
  const { email, password } = req.body || {};
  if (email === "demo@example.com" && password === "123456") {
    return res.json({ ok: true, token: "local-fake-token" });
  }
  res.status(401).json({ ok: false, error: "Invalid credentials" });
});

app.listen(3000, () => console.log("Local server running on http://localhost:3000"));
