import sqlite3 from 'sqlite3';

export default function handler(req,res){
  if(req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});

  const { username, amount } = req.body;
  const db = new sqlite3.Database(process.env.DB_PATH || './coinera.db');

  db.get("SELECT balance FROM users WHERE username=?", [username], (err,row)=>{
    if(err) return res.status(500).json({error: err.message});
    if(!row) return res.status(404).json({error:'User not found'});
    if(row.balance < amount) return res.status(400).json({error:'Insufficient balance'});

    db.run("UPDATE users SET balance=balance-? WHERE username=?", [amount, username], function(err){
      if(err) return res.status(500).json({error: err.message});
      res.status(200).json({message:`Withdrawn ${amount} coins successfully`});
    });
  });
}
