async function toggleOnTab(tab) {
  let targetTab = tab;
  if (!targetTab?.id) {
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    targetTab = activeTab;
  }
  if (!targetTab?.id) return;
  chrome.tabs.sendMessage(targetTab.id, { type: "CYBERDECK_TOGGLE_DOCK" }).catch(() => {
    // content script may not be injected yet (e.g. chrome:// pages) — ignore
  });
}

chrome.action.onClicked.addListener((tab) => toggleOnTab(tab));

chrome.commands.onCommand.addListener((command, tab) => {
  if (command === "toggle-hud") toggleOnTab(tab);
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === "CYBERDECK_CAPTURE_TAB") {
    chrome.tabs.captureVisibleTab(sender.tab.windowId, { format: "png" }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        sendResponse({ error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ dataUrl });
      }
    });
    return true; // async response
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === "CYBERDECK_PING") {
    sendResponse({ ok: true });
  }
});
