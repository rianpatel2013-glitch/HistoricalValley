'use strict';

(function () {
    // Generate unique session ID for this chat
    let currentSessionId = generateSessionId();

    const input = () => document.getElementById("userInput");
    const chat = () => document.getElementById("chat");

    // Generate a unique session ID
    function generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Append a message to chat
    function appendMessage(sender, text, id = null) {
        const empty = chat().querySelector(".empty-state");
        if (empty) empty.remove();

        const msg = document.createElement("div");
        msg.className = `message ${sender}`;
        if (id) msg.id = id;
        msg.textContent = text;
        chat().appendChild(msg);
        chat().scrollTop = chat().scrollHeight;
        return msg;
    }

    // Loading dots animation
    function animateLoading(el) {
        let dots = 0;
        return setInterval(() => {
            dots = (dots + 1) % 4;
            el.textContent = "AI is typing" + ".".repeat(dots);
        }, 500);
    }

    // Send message to backend
    window.sendMessage = async function sendMessage() {
        const value = (input().value || "").trim();
        if (!value) return;

        appendMessage("user-message", value);
        input().value = "";

        // Loading animation
        const loadingId = "loading-ai";
        const loadingEl = appendMessage("bot-message", "AI is typing...", loadingId);
        const loadingAnim = animateLoading(loadingEl);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    prompt: value,
                    session_id: currentSessionId  // Send session ID
                }),
            });

            if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
            const data = await res.json();

            clearInterval(loadingAnim);
            loadingEl.remove();

            if (data.response) appendMessage("bot-message", data.response);
            else appendMessage("bot-message", "No response received from AI.");

        } catch (err) {
            console.error(err);
            clearInterval(loadingAnim);
            loadingEl.remove();
            appendMessage("bot-message", `Error: ${err.message}`);
        }
    };

    // Handle Enter key
    window.handleEnter = function handleEnter(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    };

    // New chat - creates a fresh session
    window.newChat = function newChat() {
        // Generate new session ID for new conversation
        currentSessionId = generateSessionId();
        
        // Clear the chat display
        chat().innerHTML = '<div class="empty-state"><p>Ask AI any of your questions about Valley Ranch</p></div>';
        
        console.log('Started new chat with session:', currentSessionId);
    };
})();