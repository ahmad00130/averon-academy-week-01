// ===== Select elements =====
const greeting = document.querySelector("#greeting");
const timeMessage = document.querySelector("#timeMessage");
const nameInput = document.querySelector("#nameInput");
const charCount = document.querySelector("#charCount");
const languageSelect = document.querySelector("#languageSelect");
const greetButton = document.querySelector("#greetButton");
const clearButton = document.querySelector("#clearButton");
const errorMessage = document.querySelector("#errorMessage");
const colorButton = document.querySelector("#colorButton");
const dateButton = document.querySelector("#dateButton");
const quoteButton = document.querySelector("#quoteButton");
const dateDisplay = document.querySelector("#dateDisplay");
const quoteDisplay = document.querySelector("#quoteDisplay");
const themeButton = document.querySelector("#themeButton");
const clock = document.querySelector("#clock");
const historyList = document.querySelector("#historyList");

// ===== Data =====
const greetingWords = {
  hausa: "Sannu",
  yoruba: "Ẹ káàbọ̀",
  igbo: "Nnọọ",
  french: "Bonjour",
  spanish: "Hola"
};

const quotes = [
  "Every expert was once a beginner.",
  "Debugging is just learning in disguise.",
  "Small steps every day lead to big results.",
  "Code a little, learn a lot.",
  "Mistakes are proof that you are trying.",
  "Done is better than perfect.",
  "Great developers are made one commit at a time."
];

const colors = [
  "linear-gradient(135deg, #4f46e5, #06b6d4)",
  "linear-gradient(135deg, #f59e0b, #ef4444)",
  "linear-gradient(135deg, #10b981, #3b82f6)",
  "linear-gradient(135deg, #ec4899, #8b5cf6)",
  "linear-gradient(135deg, #0f172a, #334155)"
];
let colorIndex = 0;

const MAX_HISTORY = 5;

// ===== Safe storage helpers (localStorage can fail in some browsers) =====
function saveData(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    // ignore: the app still works without saving
  }
}

function loadData(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

// ===== Time helpers =====
function getTimeGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  } else if (hour < 17) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}

function updateClock() {
  clock.textContent = new Date().toLocaleTimeString("en-GB");
}

// ===== Greeting =====
function buildGreeting(name) {
  const language = languageSelect.value;

  if (language === "english") {
    return getTimeGreeting() + ", " + name + "! 👋";
  }

  return greetingWords[language] + ", " + name + "! 👋";
}

function isValidName(name) {
  // letters (any language), spaces, hyphens 
  return /^[\p{L}\s'-]+$/u.test(name);
}

function showGreeting() {
  const name = nameInput.value.trim();

  if (name === "") {
    errorMessage.textContent = "Please enter your name first.";
    greeting.textContent = "Welcome!";
    return;
  }

  if (!isValidName(name)) {
    errorMessage.textContent = "Names can only contain letters, spaces, hyphens and apostrophes.";
    return;
  }

  errorMessage.textContent = "";
  greeting.textContent = buildGreeting(name);

  greeting.classList.remove("pop");
  void greeting.offsetWidth;
  greeting.classList.add("pop");

  saveData("lastName", name);
  saveData("lastLanguage", languageSelect.value);
  addToHistory(name);
}


function getHistory() {
  const saved = loadData("greetingHistory");

  if (!saved) {
    return [];
  }

  try {
    return JSON.parse(saved);
  } catch (error) {
    return [];
  }
}

function renderHistory() {
  const history = getHistory();
  historyList.textContent = "";

  if (history.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "No greetings yet.";
    historyList.appendChild(empty);
    return;
  }

  history.forEach(function (name) {
    const item = document.createElement("li");
    item.textContent = name; // textContent keeps user input safe
    historyList.appendChild(item);
  });
}

function addToHistory(name) {
  let history = getHistory();

  history = history.filter(function (item) {
    return item.toLowerCase() !== name.toLowerCase();
  });
  history.unshift(name);
  history = history.slice(0, MAX_HISTORY);

  saveData("greetingHistory", JSON.stringify(history));
  renderHistory();
}


greetButton.addEventListener("click", showGreeting);

nameInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    showGreeting();
  }
});

nameInput.addEventListener("input", function () {
  charCount.textContent = nameInput.value.length + " / 30";
  errorMessage.textContent = "";
});

clearButton.addEventListener("click", function () {
  nameInput.value = "";
  charCount.textContent = "0 / 30";
  greeting.textContent = "Welcome!";
  errorMessage.textContent = "";
  dateDisplay.textContent = "";
  quoteDisplay.textContent = "";
  nameInput.focus();
});

colorButton.addEventListener("click", function () {
  colorIndex = (colorIndex + 1) % colors.length;
  document.body.style.background = colors[colorIndex];
});

dateButton.addEventListener("click", function () {
  const today = new Date();
  dateDisplay.textContent = today.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
});

quoteButton.addEventListener("click", function () {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteDisplay.textContent = "“" + quotes[randomIndex] + "”";
});

themeButton.addEventListener("click", function () {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeButton.textContent = isDark ? "☀️" : "🌙";
  saveData("theme", isDark ? "dark" : "light");
});

languageSelect.addEventListener("change", function () {
  saveData("lastLanguage", languageSelect.value);
});

timeMessage.textContent = getTimeGreeting() + "! Nice to see you.";
updateClock();
setInterval(updateClock, 1000);
renderHistory();

if (loadData("theme") === "dark") {
  document.body.classList.add("dark");
  themeButton.textContent = "☀️";
}

const savedLanguage = loadData("lastLanguage");
if (savedLanguage) {
  languageSelect.value = savedLanguage;
}

const savedName = loadData("lastName");
if (savedName) {
  nameInput.value = savedName;
  charCount.textContent = savedName.length + " / 30";
}