// Simple admin auth
const ADMIN_USER = "admin";
const ADMIN_PASS = "adminpass";

let deposits = JSON.parse(localStorage.getItem("deposits") || "[]");
let withdraws = JSON.parse(localStorage.getItem("withdraws") || "[]");
let plans = JSON.parse(localStorage.getItem("plans") || "[]");
let referrals = JSON.parse(localStorage.getItem("referrals") || "[]");

function adminLogin() {
  const u = document.getElementById("adminUser").value;
  const p = document.getElementById("adminPass").value;
  if (u === ADMIN_USER && p === ADMIN_PASS) {
    document.getElementById("adminLogin").style.display = "none";
    document.getElementById("adminDashboard").style.display = "block";
  } else {
    alert("Invalid admin login");
  }
}

function showSection(id) {
  ["deposits", "withdraws", "plans", "referrals"].forEach(sec => {
    document.getElementById(sec).style.display = "none";
  });
  document.getElementById(id).style.display = "block";
  renderSection(id);
}

function renderSection(id) {
  if (id === "deposits") {
    let ul = document.getElementById("depositList");
    ul.innerHTML = "";
    deposits.forEach((d, i) => {
      let li = document.createElement("li");
      li.textContent = `${d.user} - $${d.amount} (${d.status})`;
      if (d.status === "pending") {
        let btn = document.createElement("button");
        btn.textContent = "Approve";
        btn.onclick = () => approveDeposit(i);
        li.appendChild(btn);
      }
      ul.appendChild(li);
    });
  }

  if (id === "withdraws") {
    let ul = document.getElementById("withdrawList");
    ul.innerHTML = "";
    withdraws.forEach((w, i) => {
      let li = document.createElement("li");
      li.textContent = `${w.user} - $${w.amount} (${w.status})`;
      if (w.status === "pending") {
        let btn = document.createElement("button");
        btn.textContent = "Approve";
        btn.onclick = () => approveWithdraw(i);
        li.appendChild(btn);
      }
      ul.appendChild(li);
    });
  }

  if (id === "plans") {
    let ul = document.getElementById("planList");
    ul.innerHTML = "";
    plans.forEach(p => {
      let li = document.createElement("li");
      li.textContent = `${p.user} - ${p.planName} ($${p.price})`;
      ul.appendChild(li);
    });
  }

  if (id === "referrals") {
    let ul = document.getElementById("refList");
    ul.innerHTML = "";
    referrals.forEach(r => {
      let li = document.createElement("li");
      li.textContent = `${r.from} referred ${r.to} → earned $${r.earning}`;
      ul.appendChild(li);
    });
  }
}

function approveDeposit(i) {
  deposits[i].status = "approved";
  localStorage.setItem("deposits", JSON.stringify(deposits));
  alert("Deposit approved");
  renderSection("deposits");
}

function approveWithdraw(i) {
  withdraws[i].status = "approved";
  localStorage.setItem("withdraws", JSON.stringify(withdraws));
  alert("Withdraw approved");
  renderSection("withdraws");
}
