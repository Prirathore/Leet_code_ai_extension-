// Triggered when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
    console.log("🚀 LeetCode AI Chatbot Installed!");
});

// Listens for messages from the popup or other parts of the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    // Handle the action to fetch the Gemini response (the user's input)
    if (request.action === "fetchGeminiResponse") {
        fetchGeminiResponse(request.text, sendResponse);
        return true; // Return true to indicate we are handling this asynchronously
    } 
    
    // Handle the action to get the problem statement and user code
    else if (request.action === "getProblemAndCode") {
        // Query for the active tab
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            if (!tabs.length) {
                sendResponse({ problem: "No active tab found.", code: "" });
                return; // No active tab, return early
            }

            try {
                // Inject the content script into the active tab (content.js)
                await chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    files: ["content.js"]
                });

                // Send message to the content script to get the problem and code
                chrome.tabs.sendMessage(tabs[0].id, { action: "getProblemAndCode" }, (response) => {
                    const { problem, code } = response;  // Destructure problem and code from content script response

                    // Combine the user input text, problem statement, and code into one prompt
                    const fullPrompt = `${request.text}\n\n🧠 Problem:\n${problem}\n\n💻 Code:\n${code}`;

                     
                });
            } catch (error) {
                console.error("❌ Script injection failed:", error);
                sendResponse({ problem: "Error injecting script.", code: "" });
            }
        });
        return true; // Keep the sendResponse open for async communication
    }
});

// CORS Fix: Use a Proxy Server (Workaround) to make the API call to Gemini
function fetchGeminiResponse(userPrompt, sendResponse) {
    const API_URL = "http://localhost:3000/gemini";  // Your local server endpoint for Gemini API

    fetch(API_URL, {
        method: "POST",  // POST method for sending data to Gemini API
        headers: { "Content-Type": "application/json" },  // Set content type to JSON
        body: JSON.stringify({ prompt: userPrompt })  // Send the full prompt as JSON
    })
    .then(response => response.json())  // Parse the response as JSON
    .then(data => {
        // Send the Gemini API response back to the sender
        sendResponse({ result: data.response || "AI didn't respond 🤖" });
    })
    .catch(error => {
        console.error("❌ API Error:", error);
        sendResponse({ result: "Error! My circuits are fried. 😵" });
    });

    return true; // Keep the sendResponse open for async communication
}
