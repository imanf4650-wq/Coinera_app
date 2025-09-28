import sqlite3 from 'sqlite3';

export default function handler(req,res){
  if(req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});

  const { referrer } = req.body;
  const db = new sqlite3.Database(process.env.DB_PATH || './coinera.db');

  db.run("UPDATE users SET balance=balance+5 WHERE username=?", [referrer], function(err){
    if(err) return res.status(500).json({error: err.message});
    res.status(200).json({message:'Referral bonus added'});
  });
}
