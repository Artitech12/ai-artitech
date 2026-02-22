const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("active");
}

function newChat() {
  chatBox.innerHTML = "";
}

userInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  userInput.value = "";

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    addMessage(data.reply, "bot");

  } catch (error) {
    addMessage("Error connecting to server.", "bot");
  }
}

function addMessage(text, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  messageDiv.textContent = text;
  chatBox.appendChild(messageDiv);

  chatBox.scrollTop = chatBox.scrollHeight;
}