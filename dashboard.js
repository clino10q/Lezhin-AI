// Load logged in user and display username
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (loggedInUser) {
  document.getElementById("sidebarUsername").textContent = loggedInUser.username;
}

let conversations = JSON.parse(localStorage.getItem("ai_conversations")) || [];
let currentConvIndex = null;
let isLoading = false;

const messagesEl = document.getElementById("messages");
const inputEl = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

inputEl.addEventListener("focus", () => {
  setTimeout(() => {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }, 300);
});

const historyList = document.getElementById("historyList");
const chatTitle = document.getElementById("chatTitle");

// Load most recent conversation on page load
if (conversations.length > 0) {
  loadConversation(0);
} else {
  renderHistory();
}

function autoResize(el) {
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 120) + "px";
}

function handleKey(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function sendSuggestion(text) {
  inputEl.value = text;
  sendMessage();
}

function newChat() {
  currentConvIndex = null;
  chatTitle.textContent = "New conversation";
  messagesEl.innerHTML = `
    <div id="empty-state">
      <i class="ti ti-message-circle"></i>
      <p>Ask me anything — I'm here to help.</p>
      <div class="suggestions">
        <div class="suggestion-chip" onclick="sendSuggestion('Explain how JavaScript promises work')">How do JS promises work?</div>
        <div class="suggestion-chip" onclick="sendSuggestion('What are the best practices for secure passwords?')">Secure password tips</div>
        <div class="suggestion-chip" onclick="sendSuggestion('Give me a quick overview of localStorage vs sessionStorage')">localStorage vs sessionStorage</div>
        <div class="suggestion-chip" onclick="sendSuggestion('What is the difference between authentication and authorization?')">Auth vs authorization</div>
      </div>
    </div>`;
  renderHistory();
}

function saveToStorage() {
  localStorage.setItem("ai_conversations", JSON.stringify(conversations));
}

function renderHistory() {
  historyList.innerHTML = "";
  conversations.forEach((conv, i) => {
    const item = document.createElement("div");
    item.className = "history-item" + (i === currentConvIndex ? " active" : "");
    item.textContent = conv.title;
    item.onclick = () => loadConversation(i);
    historyList.appendChild(item);
  });
}

function loadConversation(index) {
  currentConvIndex = index;
  const conv = conversations[index];
  chatTitle.textContent = conv.title;
  messagesEl.innerHTML = "";
  conv.messages.forEach((m) => appendBubble(m.role, m.content));
  renderHistory();
  scrollBottom();
}

function appendBubble(role, content) {
  const empty = document.getElementById("empty-state");
  if (empty) empty.remove();

  const row = document.createElement("div");
  row.className = "msg-row " + role;

  const avatar = document.createElement("div");
  avatar.className = "avatar " + role;
  avatar.textContent = role === "ai" ? "AI" : "You";

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML = formatText(content);

  row.appendChild(avatar);
  row.appendChild(bubble);
  messagesEl.appendChild(row);
  return bubble;
}

function formatText(text) {
  return text
    .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
}

function showTyping() {
  const empty = document.getElementById("empty-state");
  if (empty) empty.remove();

  const row = document.createElement("div");
  row.className = "msg-row ai";
  row.id = "typing-indicator";

  const avatar = document.createElement("div");
  avatar.className = "avatar ai";
  avatar.textContent = "AI";

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML = `<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>`;

  row.appendChild(avatar);
  row.appendChild(bubble);
  messagesEl.appendChild(row);
  scrollBottom();
}

function removeTyping() {
  const el = document.getElementById("typing-indicator");
  if (el) el.remove();
}

function scrollBottom() {
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

async function sendMessage() {
  const text = inputEl.value.trim();
  if (!text || isLoading) return;

  isLoading = true;
  sendBtn.disabled = true;
  inputEl.value = "";
  inputEl.style.height = "auto";

  // Create new conversation if none is active
  if (currentConvIndex === null) {
    conversations.unshift({
      title: text.slice(0, 36) + (text.length > 36 ? "…" : ""),
      messages: [],
    });
    currentConvIndex = 0;
    chatTitle.textContent = conversations[0].title;
  }

  conversations[currentConvIndex].messages.push({ role: "user", content: text });
  appendBubble("user", text);
  renderHistory();
  showTyping();
  scrollBottom();

  // Build message history for the API
  const history = conversations[currentConvIndex].messages.map((m) => ({
    role: m.role === "ai" ? "assistant" : "user",
    content: m.content,
  }));

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system:
          "You are a helpful AI assistant in a personal dashboard. Be concise, clear, and friendly. Use markdown formatting (code blocks, bold) where helpful.",
        messages: history,
      }),
    });

    const data = await res.json();
    const reply = data.content?.[0]?.text || "Sorry, I could not get a response.";

    removeTyping();
    conversations[currentConvIndex].messages.push({ role: "ai", content: reply });
    appendBubble("ai", reply);
    saveToStorage();
  } catch (err) {
    removeTyping();
    appendBubble("ai", "Something went wrong. Please try again.");
  }

  isLoading = false;
  sendBtn.disabled = false;
  scrollBottom();
  inputEl.focus();
}
