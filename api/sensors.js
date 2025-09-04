// GET /api/sensors
// Trả dữ liệu sensor giả lập (hoặc lấy từ Firebase)
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const fakeSensors = {
    temperature: (24 + Math.random() * 6).toFixed(1),
    humidity: Math.floor(40 + Math.random() * 30),
    soil: Math.floor(30 + Math.random() * 40),
    time: new Date().toISOString()
  };

  res.status(200).json(fakeSensors);
}
