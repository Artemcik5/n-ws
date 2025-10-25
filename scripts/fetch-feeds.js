// scripts/fetch-feeds.js
import Parser from "rss-parser";
import fs from "fs";

const parser = new Parser();

const feeds = {
  science: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
  tech: "https://feeds.bbci.co.uk/news/technology/rss.xml",
  politics: "https://feeds.bbci.co.uk/news/politics/rss.xml",
};

const outDir = "./data";
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

for (const [key, url] of Object.entries(feeds)) {
  const feed = await parser.parseURL(url);
  const items = feed.items.map(i => ({
    title: i.title,
    link: i.link,
    pubDate: i.pubDate,
    summary: i.contentSnippet,
    source: "BBC News",
  }));
  fs.writeFileSync(`${outDir}/${key}.json`, JSON.stringify(items, null, 2));
  console.log(`✅ wrote ${key}.json (${items.length} articles)`);
}
