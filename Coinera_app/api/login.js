import sqlite3 from 'sqlite3';

export default function handler(req,res){
  if(req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});

  const { username, password } = req.body;
  const db = new sqlite3.Database(process.env.DB_PATH || './coinera.db');

  db.get("SELECT * FROM users WHERE username=? AND password=?", [username,password], (err,row)=>{
    if(err) return res.status(500).json({error:err.message});
    if(!row) return res.status(404).json({error:'User not found'});

    // Login successful, commission placeholder can be handled later
    res.status(200).json({message:'Login successful', balance: row.balance});
  });
}
import sqlite3 from 'sqlite3';

export default function handler(req,res){
  if(req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});

  const { username, password } = req.body;
  const db = new sqlite3.Database(process.env.DB_PATH || './coinera.db');

  db.get("SELECT * FROM users WHERE username=? AND password=?", [username,password], (err,row)=>{
    if(err) return res.status(500).json({error:err.message});
    if(!row) return res.status(404).json({error:'User not found'});
    res.status(200).json({message:'Login successful', balance: row.balance});
  });
}
