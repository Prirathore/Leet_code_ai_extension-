// injectCode.js
(function() {
    try {
        const model = window.monaco.editor.getModels()[0];
        const code = model.getValue();
        chrome.runtime.sendMessage({ type: "FETCHED_CODE", code: code });
    } catch (e) {
        console.error("Error fetching code:", e);
        chrome.runtime.sendMessage({ type: "FETCHED_CODE", code: "No code found." });
    }
})();
