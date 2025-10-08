'use strict';

(function () {
    const input = () => document.getElementById("userInput");
    const chat = () => document.getElementById("chat");
    const conversationList = () => document.getElementById("conversationList");

    /**
     * Appends a message to the chat container.
     * @param {string} sender - 'user' or 'ai'
     * @param {string} text - The message content.
     */
    function appendMessage(sender, text) {
        const container = document.createElement("div");
        // Sets class to "message user" or "message ai"
        container.className = `message ${sender}`; 
        container.textContent = text;
        chat().appendChild(container);
        // Scroll to the bottom of the chat window
        chat().scrollTop = chat().scrollHeight;
    }

    // Send User's message
    window.sendMessage = async function sendMessage() {
        const value = (input().value || "").trim();
        if (!value) return;

        // 1. Show user message immediately
        appendMessage("user", value);

        // Clear input field immediately for better UX
        input().value = "";

        // 2. Persist latest query locally (for 'loadChat' functionality)
        try {
            localStorage.setItem("lastQuery", value);
        } catch (e) {
            console.warn("localStorage write failed", e);
        }

        // 3. Send the query to the server's API
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // The server expects the user's text under the key 'prompt'
                body: JSON.stringify({ prompt: value }) 
            });

            if (!response.ok) {
                // If server returns an error status (e.g., 400, 500)
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // 4. Show the AI's response returned from the server
            // data.response contains the server-generated placeholder text
            appendMessage("ai", data.response); 

        } catch (error) {
            console.error('Fetch error:', error);
            appendMessage("ai", `Error: Could not connect to the server or process request. Details: ${error.message}`);
        }
    };

    // Enter Key can be presse dto submit prompt
    window.handleEnter = function handleEnter(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    };

    // Clears the chat area for a new conversation.
    window.newChat = function newChat() {
        chat().innerHTML = '<div class="empty-state"><p>Ask me any of your questions about Valley Ranch.</p></div>';
    };

    /**
     * Placeholder to load a conversation (currently loads last saved query from localStorage).
     * @param {number} id - Conversation ID (currently unused).
     */
    window.loadChat = function loadChat(id) {
        const saved = localStorage.getItem("lastQuery");
        chat().innerHTML = "";
        if (saved) {
            appendMessage("user", saved);
            // Updated message to reflect the server now handles the main logic
            appendMessage("ai", "Loaded last query from localStorage. Send a message to get a fresh server response.");
        } else {
            appendMessage("ai", `No saved query found for conversation ${id}.`);
        }
    };

    // On load: Check localStorage and show a hint in the sidebar if a query is saved.
    document.addEventListener("DOMContentLoaded", () => {
        const last = localStorage.getItem("lastQuery");
        if (last && conversationList()) {
            const hint = document.createElement("div");
            hint.className = "conversation hint";
            hint.textContent = "Last typed query available";
            hint.onclick = () => loadChat(0);
            conversationList().appendChild(hint);
        }
    });
})();