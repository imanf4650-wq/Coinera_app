import sqlite3 from 'sqlite3';

export default function handler(req, res) {
  if(req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const db = new sqlite3.Database(process.env.DB_PATH || './coinera.db');
  const { username, password, referral } = req.body;

  db.run(
    "INSERT INTO users (username,password,balance) VALUES (?,?,0)",
    [username,password],
    function(err){
      if(err) return res.status(500).json({ error: err.message });
      
      // Handle referral bonus
      if(referral){
        db.get("SELECT * FROM users WHERE username=?", [referral], (err,row)=>{
          if(row){
            db.run("UPDATE users SET balance=balance+5 WHERE username=?", [referral]);
          }
        });
      }

      res.status(200).json({ message: 'User created successfully' });
    }
  );
}
