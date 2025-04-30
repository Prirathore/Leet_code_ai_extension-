document.addEventListener("DOMContentLoaded", function () {
    const chatbox = document.getElementById("chatbox");
    const userInput = document.getElementById("userInput");
    const sendMessageButton = document.getElementById("sendMessage");

    // Load problem & code from LeetCode
    chrome.runtime.sendMessage({ action: "getProblemAndCode" }, (response) => {
        if (chrome.runtime.lastError) {
            console.error("❌ Error fetching problem:", chrome.runtime.lastError);
            document.getElementById("leetcodeProblem").innerText = "Error fetching problem.";
            document.getElementById("userCode").innerText = "Error fetching code.";
            return;
        }

        if (response) {
            document.getElementById("leetcodeProblem").innerText = response.problem || "Problem not found.";
            document.getElementById("userCode").innerText = response.code || "No code detected.";
        }
    });

    // Function to add a message to chatbox
    function addMessage(text, sender) {
        const msg = document.createElement("div");
        msg.classList.add("message", sender);
        msg.innerText = text;
        chatbox.appendChild(msg);
        chatbox.scrollTop = chatbox.scrollHeight; 
    }

    // Send message to background.js and get AI response
    function sendMessage() {
        const text = userInput.value.trim();
        if (text === "") return;

        addMessage(text, "user"); // Show user message
        userInput.value = "";

        chrome.runtime.sendMessage({ action: "fetchGeminiResponse", text: text }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("❌ Error fetching AI response:", chrome.runtime.lastError);
                addMessage("Oops! AI response failed. 😵 Try again!", "bot");
                return;
            }

            addMessage(response?.result || "No response. Try again!", "bot");
        });
    }

    sendMessageButton.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") sendMessage();
    });
});
