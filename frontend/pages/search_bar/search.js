// 'use strict';

// (function () {
//     // Hide the scrollbar during page fade-in animation
//     window.addEventListener("load", () => {
//         const main = document.querySelector("main");
//         if (!main) return;

//         main.addEventListener("animationend", () => {
//             document.body.style.overflow = "auto";
//         });
//     });

//     const input = () => document.getElementById("userInput");
//     const chat = () => document.getElementById("chat");

//     // Append messages to chat container
//     function appendMessage(sender, text, id = null) {
//         // Remove empty state if present
//         const empty = chat().querySelector(".empty-state");
//         if (empty) empty.remove();

//         const msgDiv = document.createElement("div");

//         // Use correct CSS classes
//         const className = sender === 'user' ? 'user-message' : 'bot-message';
//         msgDiv.className = `chat-message ${className}`;

//         if (id) msgDiv.id = id;
//         msgDiv.textContent = text;
//         chat().appendChild(msgDiv);

//         // Scroll to bottom
//         chat().scrollTop = chat().scrollHeight;
//         return msgDiv;
//     }

//     // Animate loading dots for AI typing
//     function animateLoading(el) {
//         let dots = 0;
//         return setInterval(() => {
//             dots = (dots + 1) % 4;
//             el.textContent = "AI is typing" + ".".repeat(dots);
//         }, 500);
//     }

//     // Communication w/ backend
//     window.sendMessage = async function sendMessage() {
//         const value = (input().value || "").trim();
//         if (!value) return;

//         appendMessage("user", value);
//         input().value = "";

//         // Loading message
//         const loadingId = "loading-ai";
//         const loadingEl = appendMessage("ai", "AI is typing...", loadingId);
//         const loadingInterval = animateLoading(loadingEl);

//         try {
//             const response = await fetch('/api/chat', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ prompt: value })
//             });

//             if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

//             const data = await response.json();

//             // Stop loading animation & remove element
//             clearInterval(loadingInterval);
//             loadingEl.remove();

//             if (data.response) appendMessage("ai", data.response);

//         } catch (error) {
//             console.error('Fetch error:', error);
//             clearInterval(loadingInterval);
//             loadingEl.remove();
//             appendMessage("ai", `Error: ${error.message}`);
//         }
//     };

//     // Enter key submits prompt
//     window.handleEnter = function handleEnter(e) {
//         if (e.key === "Enter") {
//             e.preventDefault();
//             sendMessage();
//         }
//     };

//     // Clears the chat area for a new conversation
//     window.newChat = function newChat() {
//         chat().innerHTML = '<div class="empty-state"><p>Ask me any of your questions about Valley Ranch.</p></div>';
//     };
// })();

'use strict';

(function () {
    const input = () => document.getElementById("userInput");
    const chat = () => document.getElementById("chat");

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
                body: JSON.stringify({ prompt: value }),
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

    // New chat
    window.newChat = function newChat() {
        chat().innerHTML = '<div class="empty-state"><p>Ask me any of your questions about Valley Ranch.</p></div>';
    };
})();
