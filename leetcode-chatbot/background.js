
chrome.runtime.onInstalled.addListener(() => {
    console.log("🚀 LeetCode AI Chatbot Installed!");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchGeminiResponse") {
        fetchGeminiResponse(request.text, sendResponse);
        return true;
    } 
    
    else if (request.action === "getProblemAndCode") {
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            if (!tabs.length) {
                sendResponse({ problem: "No active tab found.", code: "" });
                return;
            }

            try {
                await chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    files: ["content.js"]
                });

                chrome.tabs.sendMessage(tabs[0].id, { action: "getProblemAndCode" }, sendResponse);
            } catch (error) {
                console.error(" Script injection failed:", error);
                sendResponse({ problem: "Error injecting script.", code: "" });
            }
        });
        return true;
    }
});

// CORS Fix: Use a Proxy Server (Workaround)
function fetchGeminiResponse(userPrompt, sendResponse) {
    const API_URL = "http://localhost:3000/gemini";  

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt })
    })
    .then(response => response.json())
    .then(data => {
        sendResponse({ result: data.response || "AI didn't respond 🤖" });
    })
    .catch(error => {
        console.error("❌ API Error:", error);
        sendResponse({ result: "Error! My circuits are fried. 😵" });
    });

    return true; 
}
