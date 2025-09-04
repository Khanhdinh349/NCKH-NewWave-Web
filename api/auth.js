// POST /api/auth
// Body: { email, password }
export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  // 🔐 Demo logic: hardcode 1 user (sau này có thể thay bằng DB hoặc Firebase)
  if (email === "demo@example.com" && password === "123456") {
    return res.status(200).json({ ok: true, token: "fake-jwt-token" });
  }

  return res.status(401).json({ ok: false, error: "Invalid credentials" });
}
