// URL of your WebSocket backend
// const WS_URL = "ws://localhost:8080/chat";
const WS_URL = "https://vrchatbotbackend-production.up.railway.app/chat";

let socket;
const chatDiv = document.getElementById("chat");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

// Connect to WebSocket
function connect() {
    socket = new WebSocket(WS_URL);

    socket.onopen = () => {
        addMessage("System", "Connected to chatbot server.");
    };

    socket.onmessage = (event) => {
        const botMessage = event.data;
        addMessage("Bot", botMessage);
    };

    socket.onclose = () => {
        addMessage("System", "Disconnected from server. Reconnecting in 3s...");
        setTimeout(connect, 3000); // auto-reconnect
    };

    socket.onerror = (err) => {
        console.error("WebSocket error:", err);
    };
}

// Add a message to chat div
function addMessage(sender, message) {
    const p = document.createElement("p");
    p.className = sender.toLowerCase();
    p.textContent = `${sender}: ${message}`;
    chatDiv.appendChild(p);
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

// Send message to backend
function sendMessage() {
    const msg = input.value.trim();
    if (!msg || socket.readyState !== WebSocket.OPEN) return;
    socket.send(msg);
    addMessage("User", msg);
    input.value = "";
}

// Event listeners
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});

// Initialize connection
connect();
