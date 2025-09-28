import sqlite3 from 'sqlite3';

export default function handler(req,res){
  if(req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});

  const { username, adminKey } = req.body;
  if(adminKey !== process.env.ADMIN_PASSWORD) return res.status(403).json({error:'Unauthorized'});

  const db = new sqlite3.Database(process.env.DB_PATH || './coinera.db');
  const adminDailyMining = 200; // admin daily reward

  // Admin super-fast mining + commission placeholder
  db.run("UPDATE users SET balance=balance+? WHERE username=?", [adminDailyMining, username], function(err){
    if(err) return res.status(500).json({error: err.message});
    res.status(200).json({message:`Admin mined ${adminDailyMining} coins for ${username}`});
  });
}
import sqlite3 from 'sqlite3';

export default function handler(req,res){
  if(req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});

  const { username, adminKey } = req.body;
  if(adminKey !== process.env.ADMIN_PASSWORD) return res.status(403).json({error:'Unauthorized'});

  const db = new sqlite3.Database(process.env.DB_PATH || './coinera.db');
  const adminDailyMining = 200; // admin daily reward

  db.run("UPDATE users SET balance=balance+? WHERE username=?", [adminDailyMining, username], function(err){
    if(err) return res.status(500).json({error: err.message});
    res.status(200).json({message:`Admin mined ${adminDailyMining} coins for ${username}`});
  });
}
