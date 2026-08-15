document.getElementById("toggle").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;
  try {
    await chrome.tabs.sendMessage(tab.id, { type: "CYBERDECK_TOGGLE_DOCK" });
    window.close();
  } catch (e) {
    // content script not present on this page (e.g. chrome:// or web store)
    document.querySelector(".hint").textContent =
      "Can't run on this page (browser-internal pages are restricted). Try a normal website.";
  }
});
