import sqlite3 from 'sqlite3';

export default function handler(req,res){
  if(req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});

  const { referrer } = req.body;
  const db = new sqlite3.Database(process.env.DB_PATH || './coinera.db');

  const referralBonus = 5; // fixed referral coins
  db.run("UPDATE users SET balance=balance+? WHERE username=?", [referralBonus, referrer], function(err){
    if(err) return res.status(500).json({error: err.message});
    res.status(200).json({message:`${referralBonus} referral bonus coins added`});
  });
}
import sqlite3 from 'sqlite3';

export default function handler(req,res){
  if(req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});

  const { username, password, referral } = req.body;
  const db = new sqlite3.Database(process.env.DB_PATH || './coinera.db');

  db.run(
    "INSERT INTO users (username,password,balance) VALUES (?,?,0)",
    [username,password],
    function(err){
      if(err) return res.status(500).json({error:err.message});

      // Referral commission 5 coins
      if(referral){
        db.get("SELECT * FROM users WHERE username=?", [referral], (err,row)=>{
          if(row){
            db.run("UPDATE users SET balance=balance+5 WHERE username=?", [referral]);
          }
        });
      }

      res.status(200).json({message:'User created with referral commission'});
    }
  );
}
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
