const API_URL = "https://dev.to/api/articles?per_page=30";

const searchInput = document.querySelector("#searchInput");
const userFilter = document.querySelector("#userFilter");
const reloadBtn = document.querySelector("#reloadBtn");
const statusEl = document.querySelector("#status");
const postsContainer = document.querySelector("#postsContainer");

let allArticles = [];

// ---------- Status helpers ----------
function showStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);
}

function clearStatus() {
  showStatus("");
}

// ---------- Fetch ----------
async function fetchArticles() {
  showStatus("Loading articles...");
  postsContainer.innerHTML = "";

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    allArticles = await response.json();
    populateAuthorFilter();
    clearStatus();
    applyFilters();
  } catch (error) {
    console.error(error);
    showStatus(
      "Could not load articles. Check your internet connection and try again.",
      true
    );
  }
}

// ---------- Render ----------
function renderArticles(articles) {
  postsContainer.innerHTML = "";

  articles.forEach((article) => {
    const card = document.createElement("article");
    card.className = "post-card";

    const author = document.createElement("span");
    author.className = "user";
    author.textContent = `By ${article.user.name}`;

    const title = document.createElement("h2");
    title.textContent = article.title;

    const description = document.createElement("p");
    description.textContent = article.description;

    const link = document.createElement("a");
    link.href = article.url;
    link.textContent = "Read full article";
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    card.append(author, title, description, link);
    postsContainer.appendChild(card);
  });
}

// ---------- Search + filter ----------
function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedAuthor = userFilter.value;

  const filtered = allArticles.filter((article) => {
    const matchesTitle = article.title.toLowerCase().includes(query);
    const matchesAuthor =
      selectedAuthor === "all" || article.user.name === selectedAuthor;
    return matchesTitle && matchesAuthor;
  });

  if (filtered.length === 0) {
    postsContainer.innerHTML = "";
    showStatus("No articles found. Try a different search.");
    return;
  }

  clearStatus();
  renderArticles(filtered);
}

function populateAuthorFilter() {
  const authors = [...new Set(allArticles.map((a) => a.user.name))].sort();
  userFilter.innerHTML = '<option value="all">All authors</option>';

  authors.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    userFilter.appendChild(option);
  });
}

// ---------- Events ----------
searchInput.addEventListener("input", applyFilters);
userFilter.addEventListener("change", applyFilters);
reloadBtn.addEventListener("click", fetchArticles);

// ---------- Start ----------
fetchArticles();