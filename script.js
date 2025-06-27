document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("chatbot-input");
  const sendBtn = document.getElementById("send-btn");
  const messages = document.getElementById("chatbot-messages");

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
  });

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    appendMessage("user", text);
    input.value = "";
    getBotResponse(text); // Calls OpenAI directly
  }

  function appendMessage(sender, text) {
    const div = document.createElement("div");
    div.className = `message ${sender}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

 async function getBotResponse(userMessage) {
  const apiKey = "";
  const endpoint = "https://api.openai.com/v1/chat/completions";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
        max_tokens: 150,
      }),
    });

    const data = await response.json();
    console.log("OpenAI response:", data); // 🔍 See what's really returned

    if (data.choices && data.choices.length > 0) {
      const botReply = data.choices[0].message.content;
      appendMessage("bot", botReply);
    } else if (data.error) {
      appendMessage("bot", `❌ OpenAI Error: ${data.error.message}`);
    } else {
      appendMessage("bot", "❌ No valid response from OpenAI.");
    }
  } catch (error) {
    console.error("Fetch error:", error);
    appendMessage("bot", "❌ Network error or blocked request.");
  }
}

});
