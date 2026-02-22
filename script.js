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

  showTypingIndicator();

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    removeTypingIndicator();
    typeMessage(data.reply);

  } catch (error) {
    removeTypingIndicator();
    addMessage("Error connecting to server.", "bot");
  }
}

function addMessage(text, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  messageDiv.innerHTML = formatText(text);
  chatBox.appendChild(messageDiv);
  scrollToBottom();
}

function typeMessage(text) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", "bot");
  chatBox.appendChild(messageDiv);

  let i = 0;
  const speed = 20; // typing speed

  function typing() {
    if (i < text.length) {
      messageDiv.innerHTML = formatText(text.substring(0, i + 1));
      i++;
      scrollToBottom();
      setTimeout(typing, speed);
    }
  }

  typing();
}

function showTypingIndicator() {
  const typingDiv = document.createElement("div");
  typingDiv.classList.add("message", "bot");
  typingDiv.id = "typingIndicator";
  typingDiv.innerHTML = "Artitech is typing...";
  chatBox.appendChild(typingDiv);
  scrollToBottom();
}

function removeTypingIndicator() {
  const typing = document.getElementById("typingIndicator");
  if (typing) typing.remove();
}

function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

/* FORMAT RESPONSE LIKE CHATGPT */
function formatText(text) {
  return text
    .replace(/\n/g, "<br><br>") // line breaks
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // bold
}