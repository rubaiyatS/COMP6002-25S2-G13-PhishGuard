// On install, seed some test URLs into storage
chrome.runtime.onInstalled.addListener(() => {
  fetch(chrome.runtime.getURL('test_urls.json'))
    .then(resp => resp.json())
    .then(data => {
      chrome.storage.local.set({ testUrls: data });
      console.log('Seeded test URLs');
    });
});

// Helper: get the current active tab
async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

// Listen for messages from popup to scan current tab
chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.type === 'SCAN_CURRENT_TAB') {
    const tab = await getActiveTab();
    sendResponse({ url: tab?.url || '' });
    return true;
  }

  if (msg.type === 'INJECT_WARNING') {
    const tab = await getActiveTab();
    if (tab && tab.id) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (flag) => {
          // Dispatch custom event to content script to show/hide banner
          window.dispatchEvent(new CustomEvent('phishguard-toggle', { detail: { show: flag } }));
        },
        args: [msg.show === true]
      });
    }
  }
});