// Dark Matter Files — sitemap.xml generator
//
// Automatically lists every page on the site: homepage, info pages,
// every category page, and every published article. Updates itself
// every time the site rebuilds — no manual editing ever needed.
//
// IMPORTANT: update SITE_URL below if your domain changes.

const SITE_URL = "https://dark-matter-files.unsolved.workers.dev";

exports.data = {
  permalink: "/sitemap.xml",
  eleventyExcludeFromCollections: true,
};

exports.render = function (data) {
  const urls = [];

  // Homepage + static info pages
  urls.push({ loc: `${SITE_URL}/`, priority: "1.0" });
  urls.push({ loc: `${SITE_URL}/about.html`, priority: "0.5" });
  urls.push({ loc: `${SITE_URL}/faq.html`, priority: "0.5" });
  urls.push({ loc: `${SITE_URL}/privacy.html`, priority: "0.3" });
  urls.push({ loc: `${SITE_URL}/terms.html`, priority: "0.3" });

  // Every category page
  for (const cat of data.categories) {
    urls.push({ loc: `${SITE_URL}/${cat.slug}/`, priority: "0.8" });
  }

  // Every published article
  const articles = data.collections.articles || [];
  for (const article of articles) {
    urls.push({
      loc: `${SITE_URL}${article.url}`,
      lastmod: article.data.date
        ? new Date(article.data.date).toISOString().split("T")[0]
        : undefined,
      priority: "0.7",
    });
  }

  const body = urls
    .map((u) => {
      let entry = `  <url>\n    <loc>${u.loc}</loc>\n`;
      if (u.lastmod) entry += `    <lastmod>${u.lastmod}</lastmod>\n`;
      entry += `    <priority>${u.priority}</priority>\n  </url>`;
      return entry;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
};
