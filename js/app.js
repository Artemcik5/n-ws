const feeds = {
  science: "data/science.json",
  tech: "data/tech.json",
  politics: "data/politics.json"
};

let currentCategory = "science";
let articles = [];

async function loadFeed(cat) {
  document.getElementById("articles").innerHTML = "<p>Loading…</p>";
  const res = await fetch(feeds[cat]);
  articles = await res.json();
  renderArticles(articles);
}

function renderArticles(list) {
  const container = document.getElementById("articles");
  container.innerHTML = "";
  list.forEach(a => {
    const div = document.createElement("div");
    div.className = "article";
    div.innerHTML = `
      <h3><a href="${a.link}" target="_blank" rel="noopener">${a.title}</a></h3>
      <p>${a.summary || ""}</p>
      <small>${new Date(a.pubDate).toLocaleString()} — ${a.source}</small>
    `;
    container.appendChild(div);
  });
}

// category buttons
document.querySelectorAll("nav button").forEach(btn =>
  btn.addEventListener("click", () => {
    currentCategory = btn.dataset.cat;
    loadFeed(currentCategory);
  })
);

// search filter
document.getElementById("search").addEventListener("input", e => {
  const q = e.target.value.toLowerCase();
  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(q) || (a.summary || "").toLowerCase().includes(q)
  );
  renderArticles(filtered);
});

// initial load
loadFeed(currentCategory);
