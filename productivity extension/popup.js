const API = "http://localhost:5000/api";

// DOM
const loginBox = document.getElementById("auth-box");
const dashboard = document.getElementById("dashboard");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const authError = document.getElementById("auth-error");
const logoutBtn = document.getElementById("logout-btn");

const totalTimeDiv = document.getElementById("total-time");
const siteListDiv = document.getElementById("site-list");

const newBlockInput = document.getElementById("new-block");
const blockBtn = document.getElementById("block-btn");
const blockedListDiv = document.getElementById("blocked-list");

// Utils
function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

async function getToken() {
  const res = await chrome.storage.local.get("token");
  return res.token;
}

// LOGIN
loginBtn.onclick = async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!data.success) {
    authError.textContent = data.error || "Login failed";
    return;
  }

  await chrome.storage.local.set({
    token: data.token,
    userId: data.userId,
  });

  await syncBlockedSites();
  init();
};

// REGISTER
registerBtn.onclick = async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  loginBtn.click();
};

// LOGOUT
logoutBtn.onclick = async () => {
  await chrome.storage.local.remove(["token", "userId"]);
  location.reload();
};

// BLOCKED SITES
async function syncBlockedSites() {
  const token = await getToken();
  if (!token) return;

  const res = await fetch(`${API}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const user = await res.json();
  await chrome.storage.local.set({
    blockedSites: user.blockedSites || [],
  });
}

async function loadBlockedSites() {
  const data = await chrome.storage.local.get("blockedSites");
  const blocked = data.blockedSites || [];

  blockedListDiv.innerHTML = "";

  blocked.forEach((site) => {
    const div = document.createElement("div");
    div.className = "blocked-card";

    const span = document.createElement("span");
    span.textContent = site;

    const btn = document.createElement("button");
    btn.textContent = "Unblock";
    btn.onclick = () => unblock(site);

    div.append(span, btn);
    blockedListDiv.appendChild(div);
  });
}

// DASHBOARD
async function loadDashboard() {
  const today = new Date().toISOString().split("T")[0];
  const { userId } = await chrome.storage.local.get("userId");

  if (!userId) return;

  const key = `${userId}_${today}`;
  const data = await chrome.storage.local.get(key);
  const siteData = data[key] || {};

  const total = Object.values(siteData).reduce((a, b) => a + b, 0);

  totalTimeDiv.textContent = "Total Time: " + formatTime(total);
  siteListDiv.innerHTML = "";

  Object.entries(siteData).forEach(([site, seconds]) => {
    if (seconds < 60) return;

    const div = document.createElement("div");
    div.className = "site-card";
    div.textContent = `${site} — ${formatTime(seconds)}`;
    siteListDiv.appendChild(div);
  });

  loadBlockedSites();
}

// BLOCK
blockBtn.onclick = async () => {
  const site = newBlockInput.value.trim();
  if (!site) return;

  const token = await getToken();

  // 1️⃣ Update backend
  await fetch(`${API}/users/block`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ site }),
  });

  // 2️⃣ Update extension storage (SOURCE OF TRUTH)
  const { blockedSites = [] } = await chrome.storage.local.get("blockedSites");

  if (!blockedSites.includes(site)) {
    blockedSites.push(site);
    await chrome.storage.local.set({ blockedSites });
  }

  newBlockInput.value = "";
  loadBlockedSites();
};

// UNBLOCK
async function unblock(site) {
  const token = await getToken();

  await fetch(`${API}/users/unblock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ site }),
  });

  await syncBlockedSites();
}

// INIT
async function init() {
  const token = await getToken();

  if (!token) {
    loginBox.style.display = "block";
    dashboard.style.display = "none";
  } else {
    loginBox.style.display = "none";
    dashboard.style.display = "block";
    loadDashboard();
  }
}

init();
