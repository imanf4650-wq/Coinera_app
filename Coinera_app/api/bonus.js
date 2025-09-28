import sqlite3 from 'sqlite3';

export default function handler(req,res){
  if(req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});

  const { username } = req.body;
  const db = new sqlite3.Database(process.env.DB_PATH || './coinera.db');

  const dailyBonus = 7; // extra daily bonus coins
  db.run("UPDATE users SET balance=balance+? WHERE username=?", [dailyBonus, username], function(err){
    if(err) return res.status(500).json({error: err.message});
    res.status(200).json({message:`${dailyBonus} bonus coins added`});
  });
}
