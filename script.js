const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");

userInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  userInput.value = "";

  showTyping();

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    removeTyping();
    typeMessage(data.reply);

  } catch (error) {
    removeTyping();
    addMessage("Error connecting to server.", "bot");
  }
}

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.classList.add("message", sender);
  div.innerHTML = formatText(text);
  chatBox.appendChild(div);
  scrollBottom();
}

function typeMessage(text) {
  const div = document.createElement("div");
  div.classList.add("message", "bot");
  chatBox.appendChild(div);

  let i = 0;
  const speed = 15;

  function typing() {
    if (i < text.length) {
      div.innerHTML = formatText(text.substring(0, i + 1));
      i++;
      scrollBottom();
      setTimeout(typing, speed);
    }
  }

  typing();
}

function showTyping() {
  const div = document.createElement("div");
  div.classList.add("message", "bot");
  div.id = "typing";
  div.innerHTML = "Artitech is typing...";
  chatBox.appendChild(div);
  scrollBottom();
}

function removeTyping() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}

function scrollBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

/* CLEAN MARKDOWN FORMATTER */
function formatText(text) {
  return text
    .replace(/\n\n+/g, "</p><p>")
    .replace(/\n/g, "<br>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/^\d+\.\s/gm, "• ");
}