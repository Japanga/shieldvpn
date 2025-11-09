//popup.js
document.addEventListener('DOMContentLoaded', () => {
  
  const enableProxyCheckbox = document.getElementById('enableProxy');
  const proxyListElement = document.getElementById('proxyList');
  const newProxyInput = document.getElementById('newProxyInput');
  const addProxyBtn = document.getElementById('addProxyBtn');

  // Load saved proxies and settings
  chrome.storage.sync.get(['proxies', 'proxyEnabled'], (data) => {
    const proxies = data.proxies || [];
    const proxyEnabled = data.proxyEnabled || false;

    enableProxyCheckbox.checked = proxyEnabled;
    renderProxyList(proxies);
    updateProxySettings(proxyEnabled, proxies);
  });

  enableProxyCheckbox.addEventListener('change', () => {
    const isEnabled = enableProxyCheckbox.checked;
    chrome.storage.sync.get('proxies', (data) => {
      const proxies = data.proxies || [];
      updateProxySettings(isEnabled, proxies);
      chrome.storage.sync.set({ proxyEnabled: isEnabled });
    });
  });

  addProxyBtn.addEventListener('click', () => {
    const newProxy = newProxyInput.value.trim();
    if (newProxy) {
      chrome.storage.sync.get('proxies', (data) => {
        const proxies = data.proxies || [];
        proxies.push(newProxy);
        chrome.storage.sync.set({ proxies }, () => {
          renderProxyList(proxies);
          newProxyInput.value = '';
          if (enableProxyCheckbox.checked) {
            updateProxySettings(true, proxies);
          }
        });
      });
    }
  });

  function renderProxyList(proxies) {
    proxyListElement.innerHTML = '';
    proxies.forEach((proxy, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = proxy;
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', () => {
        proxies.splice(index, 1);
        chrome.storage.sync.set({ proxies }, () => {
          renderProxyList(proxies);
          if (enableProxyCheckbox.checked) {
            updateProxySettings(true, proxies);
          }
        });
      });
      listItem.appendChild(removeBtn);
      proxyListElement.appendChild(listItem);
    });
  }

  function updateProxySettings(isEnabled, proxies) {
    if (isEnabled && proxies.length > 0) {
      const selectedProxy = proxies[0]; // For simplicity, use the first added proxy
      const [host, port] = selectedProxy.split(':');
         // Example of a correct configuration for a fixed proxy
    chrome.proxy.settings.set(
        {
            value: {
                mode: "fixed_servers",
                rules: {
                    singleProxy: {
                        scheme: "http",
                        host: host,
                        port: parseInt(port)
                    },
                    bypassList: ["localhost"]
                }
            },
            scope: "regular" // or "incognito_persistent"
        });
    } else {
      chrome.proxy.settings.set({
        value: {
          mode: 'direct'
        },
        scope: 'regular'
      });
    }
  }
});