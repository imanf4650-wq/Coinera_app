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

