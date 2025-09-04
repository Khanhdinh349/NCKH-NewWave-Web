// plant.js — lấy dữ liệu từ Firebase và bơm vào UI (có ÁNH SÁNG)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getDatabase, ref, onValue,
  query, limitToLast, onChildAdded
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Config
const firebaseConfig = {
  apiKey: "AIzaSyD0uamDt3hfdZGsOjYjaoscMz91Oi47S0k",
  authDomain: "nckh---new-wave.firebaseapp.com",
  databaseURL: "https://nckh---new-wave-default-rtdb.firebaseio.com",
  projectId: "nckh---new-wave",
  storageBucket: "nckh---new-wave.firebasestorage.app",
  messagingSenderId: "431652182287",
  appId: "1:431652182287:web:5b390bce200ff50ab3467a",
  measurementId: "G-3X45XQHY9Q"
};

if (location.protocol === "file:") {
  console.warn("[Firebase] Hãy chạy qua http (Live Server), import module sẽ lỗi khi dùng file://");
}

const app = initializeApp(firebaseConfig);
const db  = getDatabase(app);

/* PATHs */
const PATH_CURRENT = "Node_1/Sensor";    // hiện tại (Temperature, Humidity, Soil_moisture, Light_sensor, Camera)
const PATH_FEED    = "Node_1/Readings";  // tùy chọn: lịch sử nếu bạn có

/* 1) Giá trị hiện tại */
onValue(ref(db, PATH_CURRENT), (snap) => {
  if (!snap.exists()) {
    console.warn("[Firebase] Không thấy dữ liệu tại", PATH_CURRENT);
    return;
  }
  const v = snap.val();
  const temp  = Number(v.Temperature ?? v.temp);
  const hum   = Number(v.Humidity ?? v.hum);
  const soil  = Number(v.Soil_moisture ?? v.soil ?? v.soil_moisture);
  const light = Number(v.Light_sensor ?? v.light);
  const cam   = v.Camera || null;

  if ([temp, hum, soil, light].some(n => !Number.isFinite(n))) {
    console.warn("[Firebase] Giá trị không hợp lệ:", v);
    return;
  }
  // UI: thêm tham số LIGHT
  window.pushRealtime?.(temp, hum, soil, light, Date.now(), cam);
}, (err)=>console.error("[Firebase] onValue(current) lỗi:", err));

/* 2) (Tùy chọn) Lịch sử: nếu có Node_1/Readings */
try {
  const qInit = query(ref(db, PATH_FEED), limitToLast(100));
  onChildAdded(qInit, (snap) => {
    const v = snap.val(); if (!v) return;
    const t = Number(v.Temperature ?? v.temp);
    const h = Number(v.Humidity ?? v.hum);
    const s = Number(v.Soil_moisture ?? v.soil ?? v.soil_moisture);
    const l = Number(v.Light_sensor ?? v.light);
    const cam = v.Camera || null;
    const ts  = v.ts ? Number(v.ts) : Date.now();
    if ([t,h,s,l].some(n => !Number.isFinite(n))) return;
    window.pushRealtime?.(t, h, s, l, ts, cam);
  }, (err)=>{
    console.info("[Firebase] Không nạp feed (không có/không cho đọc).", err?.code || err);
  });
} catch (e) {
  console.info("[Firebase] Bỏ qua feed do môi trường không hỗ trợ:", e);
}
