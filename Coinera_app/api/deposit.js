import sqlite3 from 'sqlite3';

export default function handler(req,res){
  if(req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});

  const { username, amount } = req.body;
  const db = new sqlite3.Database(process.env.DB_PATH || './coinera.db');

  const commissionPercent = 5; // 5% commission
  const netAmount = amount - (amount * commissionPercent / 100);

  db.run("UPDATE users SET balance=balance+? WHERE username=?", [netAmount, username], function(err){
    if(err) return res.status(500).json({error: err.message});
    res.status(200).json({message:`Deposited ${netAmount} coins after ${commissionPercent}% commission`});
  });
}
import sqlite3 from 'sqlite3';

export default function handler(req,res){
  if(req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});

  const { username, amount } = req.body;
  const db = new sqlite3.Database(process.env.DB_PATH || './coinera.db');

  db.run("UPDATE users SET balance=balance+? WHERE username=?", [amount, username], function(err){
    if(err) return res.status(500).json({error: err.message});
    res.status(200).json({message:`Deposited ${amount} coins successfully`});
  });
}
