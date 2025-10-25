const feeds = {
  science: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
  technology: "https://feeds.bbci.co.uk/news/technology/rss.xml",
  politics: "https://feeds.bbci.co.uk/news/politics/rss.xml"
};

let currentCategory = "science";
let articles = [];

document.getElementById("controls").addEventListener("click", e => {
  if (e.target.dataset.cat) {
    currentCategory = e.target.dataset.cat;
    loadFeed(currentCategory);
  }
});

document.getElementById("search").addEventListener("input", e => {
  renderArticles(articles.filter(a =>
    a.title.toLowerCase().includes(e.target.value.toLowerCase())
  ));
});

async function loadFeed(cat) {
  const url = feeds[cat];
  document.getElementById("articles").innerHTML = "<p>Loading…</p>";
  try {
    const resp = await fetch(url);
    const text = await resp.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "application/xml");
    const items = Array.from(xml.querySelectorAll("item"));
    articles = items.map(it => ({
      title: it.querySelector("title").textContent,
      link: it.querySelector("link").textContent,
      pubDate: it.querySelector("pubDate").textContent,
      description: it.querySelector("description").textContent
    }));
    renderArticles(articles);
  } catch(err) {
    document.getElementById("articles").innerHTML = "<p>Error loading feed.</p>";
    console.error(err);
  }
}

function renderArticles(list) {
  const container = document.getElementById("articles");
  container.innerHTML = "";
  list.forEach(a => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3><a href="${a.link}" target="_blank" rel="noopener">${a.title}</a></h3>
      <p>${a.description}</p>
      <p><small>${a.pubDate}</small></p>
      <hr>
    `;
    container.append(div);
  });
}

// initial load
loadFeed(currentCategory);
