const API_BASE = '/api';

async function signup(username,password){
  const res = await fetch(`${API_BASE}/signup.js`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({username,password})
  });
  return res.json();
}

async function login(username,password){
  const res = await fetch(`${API_BASE}/login.js`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({username,password})
  });
  return res.json();
}

async function mine(username){
  const res = await fetch(`${API_BASE}/mine.js`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({username})
  });
  return res.json();
}

async function deposit(username,amount){
  const res = await fetch(`${API_BASE}/deposit.js`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({username,amount})
  });
  return res.json();
}

async function withdraw(username,amount){
  const res = await fetch(`${API_BASE}/withdraw.js`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({username,amount})
  });
  return res.json();
}

async function referral(referrer){
  const res = await fetch(`${API_BASE}/referral.js`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({referrer})
  });
  return res.json();
}

async function bonus(username){
  const res = await fetch(`${API_BASE}/bonus.js`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({username})
  });
  return res.json();
}

// Example: Update UI, handle button clicks, show alerts
document.getElementById('signupBtn').onclick = async ()=>{
  const username=document.getElementById('signupUser').value;
  const password=document.getElementById('signupPass').value;
  const r = await signup(username,password);
  alert(r.message||r.error);
}

// Similar bindings for login, mine, deposit, withdraw, referral, bonus
async function signup(){
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const referralId = document.getElementById('referral').value;
  const res = await fetch('/api/signup',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({username,password,referralId})
  });
  const data = await res.json();
  alert(data.success ? 'Signup successful!' : data.error);
}

async function login(){
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const res = await fetch('/api/login',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({username,password})
  });
  const data = await res.json();
  alert(data.success ? 'Login success!' : 'Login failed');
}

async function mine(userId){
  const res = await fetch('/api/mine',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({userId})
  });
  const data = await res.json();
  if(data.success) alert(`Coins mined: ${data.reward}`);
}

async function deposit(userId, amount){
  const res = await fetch('/api/deposit',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({userId, amount})
  });
  const data = await res.json();
  alert(`Deposit success! Admin Comm: ${data.adminComm}, Referral Comm: ${data.referralComm}`);
}

async function withdraw(userId, amount){
  const res = await fetch('/api/withdraw',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({userId, amount})
  });
  const data = await res.json();
  alert(data.success ? `Withdraw success! Admin Commission: ${data.adminComm || 0}` : 'Failed');
}

