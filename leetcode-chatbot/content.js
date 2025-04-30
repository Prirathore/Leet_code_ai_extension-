chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getProblemAndCode") {
        let metaDesc = document.querySelector('meta[property="og:description"]');
        let problemText = metaDesc ? metaDesc.content : "Unable to find problem.";
        
        let editorElement = document.querySelector(".CodeMirror-code") || document.querySelector(".monaco-editor");
        let userCode = editorElement ? editorElement.innerText : "No code found.";

        sendResponse({ problem: problemText, code: userCode });
    }
});

console.log("🚀 LeetCode Assistant: Script loaded! ");
