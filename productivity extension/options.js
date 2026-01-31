const input = document.getElementById("newSite");
const addBtn = document.getElementById("addBtn");
const siteList = document.getElementById("siteList");

function loadBlockedSites() {
  chrome.storage.local.get(["blockedSites"], (data) => {
    siteList.innerHTML = "";
    const sites = data.blockedSites || [];
    sites.forEach((site) => {
      const li = document.createElement("li");
      li.textContent = site;
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.onclick = () => removeSite(site);
      li.appendChild(removeBtn);
      siteList.appendChild(li);
    });
  });
}

function addSite() {
  const site = input.value.trim();
  if (!site) return;
  chrome.storage.local.get(["blockedSites"], (data) => {
    const sites = data.blockedSites || [];
    if (!sites.includes(site)) {
      sites.push(site);
      chrome.storage.local.set({ blockedSites: sites }, loadBlockedSites);
    }
  });
  input.value = "";
}

function removeSite(site) {
  chrome.storage.local.get(["blockedSites"], (data) => {
    let sites = data.blockedSites || [];
    sites = sites.filter((s) => s !== site);
    chrome.storage.local.set({ blockedSites: sites }, loadBlockedSites);
  });
}

addBtn.addEventListener("click", addSite);
window.onload = loadBlockedSites;
