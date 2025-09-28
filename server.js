const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const db = new sqlite3.Database('./coinera.db');

// --- DB tables ---
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE,
  password TEXT,
  balance REAL DEFAULT 0,
  lastLogin DATE,
  referralId INTEGER
)`);

db.run(`CREATE TABLE IF NOT EXISTS admin (
  id INTEGER PRIMARY KEY,
  username TEXT,
  password TEXT,
  balance REAL DEFAULT 0
)`);

// Init admin
db.get("SELECT * FROM admin WHERE username='admin'", (err,row)=>{
  if(!row) db.run("INSERT INTO admin (username,password,balance) VALUES ('admin','adminpass',0)");
});

// --- User signup ---
app.post('/api/signup', (req,res)=>{
  const {username,password,referralId} = req.body;
  db.run("INSERT INTO users (username,password,referralId) VALUES (?,?,?)",
    [username,password,referralId || null],
    function(err){ 
      if(err) return res.json({success:false,error:'Username exists'});
      res.json({success:true,userId:this.lastID});
    });
});

// --- User login ---
app.post('/api/login',(req,res)=>{
  const {username,password} = req.body;
  db.get("SELECT * FROM users WHERE username=? AND password=?", [username,password], (err,row)=>{
    if(err || !row) return res.json({success:false});
    res.json({success:true,user:row});
  });
});

// --- Daily mining (user) ---
app.post('/api/mine',(req,res)=>{
  const {userId} = req.body;
  const today = new Date().toISOString().slice(0,10);
  db.get("SELECT * FROM users WHERE id=?", [userId], (err,user)=>{
    if(!user) return res.json({success:false});
    const reward = 50 + 7; // 50 daily mining + 7 daily bonus
    db.run("UPDATE users SET balance=balance+?, lastLogin=? WHERE id=?", [reward,today,userId]);
    res.json({success:true,reward});
  });
});

// --- Admin mining ---
app.post('/api/admin/mine',(req,res)=>{
  const reward = 200;
  db.run("UPDATE admin SET balance=balance+?", [reward]);
  res.json({success:true,reward});
});

// --- Deposit / Buy plan ---
app.post('/api/deposit', (req,res)=>{
  const {userId, amount} = req.body;

  db.get("SELECT * FROM users WHERE id=?", [userId], (err,user)=>{
    if(!user) return res.json({success:false,error:'User not found'});

    // Update user balance
    db.run("UPDATE users SET balance=balance+? WHERE id=?", [amount,userId]);

    // Admin commission 10%
    const adminComm = amount * 0.10;
    db.run("UPDATE admin SET balance=balance+?", [adminComm]);

    // Referral commission 5%
    let referralComm = 0;
    if(user.referralId){
      referralComm = amount * 0.05;
      db.run("UPDATE users SET balance=balance+? WHERE id=?", [referralComm,user.referralId]);
    }

    res.json({success:true, adminComm, referralComm});
  });
});

// --- Withdraw ---
app.post('/api/withdraw',(req,res)=>{
  const {userId,amount,isAdmin} = req.body;
  if(isAdmin){
    db.run("UPDATE admin SET balance=balance-? WHERE id=1",[amount], err=>{
      if(err) return res.json({success:false});
      res.json({success:true});
    });
  }else{
    // Withdraw commission to admin 5%
    const adminComm = amount * 0.05;
    db.run("UPDATE admin SET balance=balance+?", [adminComm]);

    db.run("UPDATE users SET balance=balance-? WHERE id=?",[amount,userId], err=>{
      if(err) return res.json({success:false});
      res.json({success:true, adminComm});
    });
  }
});

// --- Start server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
