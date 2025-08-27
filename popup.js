const urlInput = document.getElementById('urlInput');
const scanBtn = document.getElementById('scanBtn');
const scanCurrentBtn = document.getElementById('scanCurrentBtn');
const result = document.getElementById('result');
const toggleBanner = document.getElementById('toggleBanner');
const testUrlList = document.getElementById('testUrlList');

// Load seeded test URLs
chrome.storage.local.get(['testUrls'], ({ testUrls }) => {
  if (testUrls && Array.isArray(testUrls.samples)) {
    testUrlList.innerHTML = '';
    testUrls.samples.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.label.toUpperCase()}: ${item.url}`;
      testUrlList.appendChild(li);
    });
  }
});

function simulateDetection(u) {
  if (!u) return { label: 'unknown', reason: 'No URL provided' };
  const lowered = u.toLowerCase();
  // Simple heuristics for simulation
  const suspicious =
    lowered.includes('@') ||
    lowered.includes('login') ||
    lowered.includes('verify') ||
    lowered.startsWith('http://') ||
    lowered.length > 80;

  return suspicious
    ? { label: 'phishing', reason: 'Heuristics matched (Week 4 demo)' }
    : { label: 'safe', reason: 'No suspicious pattern found' };
}

function showResult(obj) {
  result.classList.remove('safe', 'phish');
  if (obj.label === 'phishing') {
    result.textContent = `⚠️ Suspicious: ${obj.reason}`;
    result.classList.add('phish');
  } else if (obj.label === 'safe') {
    result.textContent = `✅ Safe: ${obj.reason}`;
    result.classList.add('safe');
  } else {
    result.textContent = 'Enter a URL or scan current tab.';
  }
}

scanBtn.addEventListener('click', () => {
  const u = urlInput.value.trim();
  showResult(simulateDetection(u));
});

scanCurrentBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'SCAN_CURRENT_TAB' }, (resp) => {
    const u = resp?.url || '';
    urlInput.value = u;
    showResult(simulateDetection(u));
  });
});

toggleBanner.addEventListener('change', (e) => {
  chrome.runtime.sendMessage({ type: 'INJECT_WARNING', show: e.target.checked });
});