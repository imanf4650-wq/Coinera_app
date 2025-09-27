let currentUser = null;
let users = {};
let coins = 0;
let miningInterval;

let plans = [
  { id: 1, name: "Starter", price: 10, profit: 15 },
  { id: 2, name: "Pro", price: 25, profit: 40 },
  { id: 3, name: "VIP", price: 50, profit: 90 },
];

window.onload = () => {
  let planSelect = document.getElementById("plans");
  if (planSelect) {
    plans.forEach(p => {
      let opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = `${p.name} - $${p.price} → Earn $${p.profit}`;
      planSelect.appendChild(opt);
    });
  }

  document.getElementById("signupBtn").onclick = signup;
  document.getElementById("loginBtn").onclick = login;
  document.getElementById("startMine").onclick = startMining;
  document.getElementById("buyPlanBtn").onclick = buyPlan;
  document.getElementById("requestDepositBtn").onclick = requestDeposit;
  document.getElementById("requestWithdrawBtn").onclick = requestWithdraw;
};

function signup() {
  let u = document.getElementById("username").value;
  let p = document.getElementById("password").value;
  let r = document.getElementById("ref").value;

  if (!u || !p) {
    alert("Username aur password likho!");
    return;
  }
  if (users[u]) {
    alert("Ye username already exist karta hai!");
    return;
  }
  users[u] = { password: p, balance: 0, mined: 0, ref: r, plans: [] };
  alert("Signup successful!");
}

function login() {
  let u = document.getElementById("username").value;
  let p = document.getElementById("password").value;

  if (users[u] && users[u].password === p) {
    currentUser = u;
    document.getElementById("auth").style.display = "none";
    document.getElementById("panel").style.display = "block";
    document.getElementById("usern").innerText = u;
    document.getElementById("balance").innerText = users[u].balance;
    document.getElementById("mined").innerText = users[u].mined;
    document.getElementById("myRef").innerText = "REF-" + u;
  } else {
    alert("Galat username ya password!");
  }
}

function startMining() {
  if (!currentUser) {
    alert("Pehle login karo!");
    return;
  }
  if (miningInterval) {
    alert("Mining already chal rahi hai!");
    return;
  }
  miningInterval = setInterval(() => {
    users[currentUser].mined += 1;
    document.getElementById("mined").innerText = users[currentUser].mined;
  }, 1000);
}

function buyPlan() {
  if (!currentUser) return;
  let planId = parseInt(document.getElementById("plans").value);
  let plan = plans.find(p => p.id === planId);

  if (users[currentUser].balance < plan.price) {
    alert("Balance kam hai! Pehle deposit karo.");
    return;
  }

  users[currentUser].balance -= plan.price;
  users[currentUser].plans.push(plan);
  document.getElementById("balance").innerText = users[currentUser].balance;

  setTimeout(() => {
    users[currentUser].balance += plan.profit;
    document.getElementById("balance").innerText = users[currentUser].balance;
    alert(`${plan.name} plan complete! Profit added.`);
  }, 5000); // 5 sec demo delay
}

function requestDeposit() {
  if (!currentUser) return;
  let amt = parseFloat(document.getElementById("depAmt").value);
  let method = document.getElementById("depMethod").value;
  let details = document.getElementById("depDetails").value;

  if (!amt || amt <= 0) {
    alert("Amount galat hai");
    return;
  }
  alert(`Deposit request sent: $${amt}, via ${method}, details: ${details}`);
  // Real system: send request to backend
}

function requestWithdraw() {
  if (!currentUser) return;
  let amt = parseFloat(document.getElementById("withAmt").value);
  let method = document.getElementById("withMethod").value;
  let details = document.getElementById("withDetails").value;

  if (!amt || amt <= 0) {
    alert("Amount galat hai");
    return;
  }
  if (users[currentUser].balance < amt) {
    alert("Balance kam hai!");
    return;
  }

  users[currentUser].balance -= amt;
  document.getElementById("balance").innerText = users[currentUser].balance;
  alert(`Withdraw request sent: $${amt}, via ${method}, to: ${details}`);
  // Real system: send request to backend, admin confirm karega
}
