document.addEventListener("DOMContentLoaded", function () {
  const chatbotContainer = document.getElementById("chatbot-container");
  const chatbotIcon = document.getElementById("chatbot-icon");
  const closeBtn = document.getElementById("close-btn");
  const sendBtn = document.getElementById("send-btn");
  const chatbotInput = document.getElementById("chatbot-input");
  const chatbotMessages = document.getElementById("chatbot-messages");

  // 🔹 Open chatbot
  chatbotIcon.addEventListener("click", function () {
    chatbotContainer.classList.remove("hidden");
    chatbotIcon.style.display = "none";
  });

  // 🔹 Close chatbot
  closeBtn.addEventListener("click", function () {
    chatbotContainer.classList.add("hidden");
    chatbotIcon.style.display = "flex";
  });

  // 🔹 Send button click
  sendBtn.addEventListener("click", sendMessage);

  // 🔹 Enter key send
  chatbotInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault(); 
      sendMessage();
    }
  });

  // 🔹 Main Send Function
  function sendMessage() {
    const userMessage = chatbotInput.value.trim();
    if (!userMessage) return;

    appendMessage("user", userMessage);
    chatbotInput.value = "";

    getBotResponse(userMessage);
  }

  // 🔹 Append message to UI
  function appendMessage(sender, message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    messageElement.textContent = message;
    chatbotMessages.appendChild(messageElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  // 🔹 Get response from backend
  async function getBotResponse(userMessage) {
    appendMessage("bot", "Typing...");

    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();

      // Remove "Typing..."
      chatbotMessages.lastChild.remove();

      appendMessage("bot", data.reply);
    } catch (error) {
      chatbotMessages.lastChild.remove();
      appendMessage("bot", "Error connecting to server.");
      console.error(error);
    }
  }
});
