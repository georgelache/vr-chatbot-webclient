// URL of your WebSocket backend
// const WS_URL = "ws://localhost:8080/chat";
const WS_URL = "https://vrchatbotbackend-production.up.railway.app/chat";

let socket;
// Connect to WebSocket
function connect() {

    socket = new WebSocket(WS_URL);
    socket.onopen = () => {
        addMessage("Connected to chatbot server.", false);
    };

    socket.onclose = () => {
        addMessage("Disconnected from server. Reconnecting in 3s...", false);
        setTimeout(connect, 3000); // auto-reconnect
    };

    socket.onerror = (err) => {
        console.error("WebSocket error:", err);
    };

    socket.onmessage = (event) => {
        const response = event.data;
        console.log("Received from server:", response);

        addMessage(response, false);
        speak(response);
        // handle the response here
    };
}

function toggleChat() {
    const chatbot = document.getElementById('chatbot');
    chatbot.classList.toggle('open');
}

let selectedVoice = null;
function loadVoices() {
    const voices = speechSynthesis.getVoices();
    selectedVoice = voices.find(v => v.name.includes("Daniel") || (v.lang === "en-GB" && v.name.toLowerCase().includes("male")));
}


function addMessage(msg, isUser=true) {
      const responseBox = document.createElement("div");
      responseBox.className = "response-box";

      if (isUser) {
          responseBox.innerHTML = `
              <div class="label">You say:</div>
              <div class="response">${msg}</div>
          `;
      } else {
        responseBox.innerHTML = `
              <div class="label">Artemis says:</div>
              <div class="response">${msg}</div>
            `;
      }
      const chatArea = document.getElementById('chat-area');
      chatArea.appendChild(responseBox);
      chatArea.scrollTop = chatArea.scrollHeight;
        // Clear input field
      document.getElementById('userInput').value = "";
}

function showResponse() {
    const input = document.getElementById('userInput').value;
    console.log("User input:", input);
    socket.send(input);
    addMessage(input);
}


function sendEcoTip() {
    const input = "Give me an ecology tip";
    console.log("User input:", input);
    socket.send(input);
    addMessage(input);
}

function startVoiceInput() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('userInput').value = transcript;
        showResponse();
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
    };

    recognition.start();
}

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }
    speechSynthesis.speak(utterance);
}

if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
}

// Initialize connection
connect();
loadVoices();