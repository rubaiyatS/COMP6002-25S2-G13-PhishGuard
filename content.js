(function(){
  let banner;

  function ensureBanner() {
    if (banner) return banner;
    banner = document.createElement('div');
    banner.id = 'phishguard-banner';
    banner.textContent = '⚠️ PhishGuard: This site looks suspicious (simulation)';
    Object.assign(banner.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      zIndex: '2147483647',
      padding: '12px 16px',
      background: 'rgba(220, 53, 69, 0.95)', // red-like
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
      fontSize: '16px',
      textAlign: 'center',
      display: 'none',
      boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
    });
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Dismiss';
    Object.assign(closeBtn.style, {
      marginLeft: '12px',
      padding: '6px 10px',
      border: 'none',
      cursor: 'pointer',
      borderRadius: '6px'
    });
    closeBtn.addEventListener('click', () => {
      banner.style.display = 'none';
    });
    banner.appendChild(closeBtn);
    document.documentElement.appendChild(banner);
    return banner;
  }

  // Listen for toggle events issued by background script
  window.addEventListener('phishguard-toggle', (e) => {
    const show = e.detail?.show;
    const b = ensureBanner();
    b.style.display = show ? 'block' : 'none';
  }, false);
})();