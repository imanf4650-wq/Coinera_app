// server.js - Express backend for Coinera
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const db = new sqlite3.Database("./coinera.db");

// Create tables if not exist
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT, balance REAL DEFAULT 0, referral TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS deposits (id INTEGER PRIMARY KEY, user TEXT, amount REAL, status TEXT DEFAULT 'pending')");
  db.run("CREATE TABLE IF NOT EXISTS withdraws (id INTEGER PRIMARY KEY, user TEXT, amount REAL, status TEXT DEFAULT 'pending')");
  db.run("CREATE TABLE IF NOT EXISTS plans (id INTEGER PRIMARY KEY, user TEXT, planName TEXT, price REAL)");
  db.run("CREATE TABLE IF NOT EXISTS referrals (id INTEGER PRIMARY KEY, referrer TEXT, referred TEXT, earning REAL)");
});

// User signup
app.post("/api/signup", (req, res) => {
  const { username, password, referral } = req.body;
  db.run("INSERT INTO users (username, password, referral) VALUES (?, ?, ?)", [username, password, referral], function (err) {
    if (err) return res.status(400).json({ error: "User already exists" });
    res.json({ success: true });
  });
});

// User login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username=? AND password=?", [username, password], (err, row) => {
    if (row) res.json({ success: true, user: row });
    else res.json({ success: false, error: "Invalid login" });
  });
});

// Deposit request
app.post("/api/deposit", (req, res) => {
  const { user, amount } = req.body;
  db.run("INSERT INTO deposits (user, amount) VALUES (?, ?)", [user, amount], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Withdraw request
app.post("/api/withdraw", (req, res) => {
  const { user, amount } = req.body;
  db.run("INSERT INTO withdraws (user, amount) VALUES (?, ?)", [user, amount], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Admin approve deposit
app.post("/api/admin/deposit/approve", (req, res) => {
  const { id } = req.body;
  db.run("UPDATE deposits SET status='approved' WHERE id=?", [id], function () {
    res.json({ success: true });
  });
});

// Admin approve withdraw
app.post("/api/admin/withdraw/approve", (req, res) => {
  const { id } = req.body;
  db.run("UPDATE withdraws SET status='approved' WHERE id=?", [id], function () {
    res.json({ success: true });
  });
});

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Coinera server running on port ${PORT}`));
