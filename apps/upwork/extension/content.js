(() => {
  const isJobPage = () => /\/jobs?\//.test(location.pathname) || /\/job\//.test(location.pathname);

  async function mount() {
    if (!/^https:\/\/www\.upwork\.com\//.test(location.href)) return;
    if (!isJobPage()) return;
    const { insertAnalyzeButton } = await import(chrome.runtime.getURL("modules/insertAnalyzeButton.js"));
    insertAnalyzeButton();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }

  let last = location.href;
  new MutationObserver(() => {
    if (location.href !== last) {
      last = location.href;
      mount();
    }
  }).observe(document, { subtree: true, childList: true });
})();
