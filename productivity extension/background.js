const API_URL = "http://localhost:5000/api/usage/track";

let currentSite = null;
let lastActiveTime = Date.now();
let bufferSeconds = {};
let warnedNoToken = false;

/* ---------- INIT ---------- */
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get("blockedSites", (res) => {
    if (!Array.isArray(res.blockedSites)) {
      chrome.storage.local.set({ blockedSites: [] });
    }
  });
});

/* ---------- UTILS ---------- */
function getDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/* ---------- BLOCK LOGIC (WORKING) ---------- */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!changeInfo.url) return;

  const site = getDomain(changeInfo.url);
  if (!site) return;

  chrome.storage.local.get("blockedSites", (res) => {
    const blocked = res.blockedSites || [];

    if (blocked.includes(site)) {
      // stop time tracking immediately
      currentSite = null;
      lastActiveTime = Date.now();

      chrome.tabs.update(tabId, {
        url: chrome.runtime.getURL("blocked.html"),
      });
    }
  });
});

/* ---------- TIME TRACKING (NO EXTRA MINUTES) ---------- */
function updateTime(newSite) {
  const now = Date.now();

  if (currentSite) {
    const seconds = Math.floor((now - lastActiveTime) / 1000);

    if (seconds > 0) {
      bufferSeconds[currentSite] = (bufferSeconds[currentSite] || 0) + seconds;

      chrome.storage.local.get("userId", ({ userId }) => {
        if (!userId) return;

        const today = new Date().toISOString().split("T")[0];
        const key = `${userId}_${today}`;

        chrome.storage.local.get(key, (res) => {
          const dayData = res[key] || {};
          dayData[currentSite] = (dayData[currentSite] || 0) + seconds;
          chrome.storage.local.set({ [key]: dayData });
        });
      });
    }
  }

  currentSite = newSite;
  lastActiveTime = now;
}

/* ---------- TRACK ON TAB SWITCH ---------- */
chrome.tabs.onActivated.addListener(async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!tab?.url) return;

  const site = getDomain(tab.url);
  if (site) updateTime(site);
});

/* ---------- TRACK ON PAGE LOAD ---------- */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;
  if (!tab.active || !tab.url) return;

  const site = getDomain(tab.url);
  if (site) updateTime(site);
});

/* ---------- BACKEND SYNC ---------- */
setInterval(() => {
  chrome.storage.local.get("token", (res) => {
    const token = res.token;

    if (!token) {
      if (!warnedNoToken) {
        console.warn("⚠️ No auth token, skipping backend sync");
        warnedNoToken = true;
      }
      return;
    }

    warnedNoToken = false;

    Object.entries(bufferSeconds).forEach(([site, seconds]) => {
      if (seconds <= 0) return;

      fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ website: site, seconds }),
      })
        .then(() => {
          bufferSeconds[site] = 0;
        })
        .catch(console.error);
    });
  });
}, 10000);
