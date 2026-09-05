module.exports = function (eleventyConfig) {
  // Copy static assets straight through, unchanged
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/static");
  eleventyConfig.addPassthroughCopy({ admin: "admin" });

  // Homepage + info pages: copied as-is (not run through the template engine),
  // since they're already complete, self-contained HTML files
  eleventyConfig.addPassthroughCopy({ "static-pages/index.html": "index.html" });
  eleventyConfig.addPassthroughCopy({ "static-pages/about.html": "about.html" });
  eleventyConfig.addPassthroughCopy({ "static-pages/faq.html": "faq.html" });
  eleventyConfig.addPassthroughCopy({ "static-pages/privacy.html": "privacy.html" });
  eleventyConfig.addPassthroughCopy({ "static-pages/terms.html": "terms.html" });

  // Category metadata: label, slug, accent color, short description
  const categoryList = [
    {
      slug: "ufo-files",
      label: "UFO Files",
      accent: "#5ED9C9",
      accentDim: "rgba(94,217,201,0.12)",
      desc: "Sightings, radar anomalies, and unexplained aerial phenomena.",
    },
    {
      slug: "unsolved-mystery",
      label: "Unsolved Mystery",
      accent: "#C9A227",
      accentDim: "rgba(201,162,39,0.12)",
      desc: "Disappearances, hoaxes, and cases that were never closed.",
    },
    {
      slug: "paranormal",
      label: "Paranormal",
      accent: "#D65239",
      accentDim: "rgba(214,82,57,0.12)",
      desc: "Hauntings, exorcisms, and encounters beyond explanation.",
    },
    {
      slug: "unexplored-ocean",
      label: "Unexplored Ocean",
      accent: "#2FB8C4",
      accentDim: "rgba(47,184,196,0.12)",
      desc: "Unknown sea creatures and the depths we haven't mapped.",
    },
    {
      slug: "space-time",
      label: "Space & Time",
      accent: "#9D6FE0",
      accentDim: "rgba(157,111,224,0.12)",
      desc: "Time-slip accounts and the search for what's out there.",
    },
    {
      slug: "science-tech",
      label: "Science & Technology",
      accent: "#6F8FE0",
      accentDim: "rgba(111,143,224,0.12)",
      desc: "Breakthroughs, forgotten inventions, and the tech that shouldn't exist yet.",
    },
  ];
  const categories = {};
  for (const c of categoryList) categories[c.slug] = c;

  eleventyConfig.addGlobalData("categories", categoryList);
  eleventyConfig.addGlobalData("categoryMap", categories);

  function toTime(d) {
    if (!d) return 0;
    const t = new Date(d).getTime();
    return isNaN(t) ? 0 : t;
  }

  // Article collection, newest first
  eleventyConfig.addCollection("articles", (api) => {
    return api.getFilteredByGlob("src/content/articles/*.md").sort((a, b) => {
      return toTime(b.data.date) - toTime(a.data.date);
    });
  });

  // Per-category collections: articlesByCategory["ufo-files"] etc.
  eleventyConfig.addCollection("articlesByCategory", (api) => {
    const all = api.getFilteredByGlob("src/content/articles/*.md");
    const grouped = {};
    for (const key of Object.keys(categories)) grouped[key] = [];
    for (const item of all) {
      const cat = item.data.category;
      if (grouped[cat]) grouped[cat].push(item);
    }
    for (const key of Object.keys(grouped)) {
      grouped[key].sort((a, b) => toTime(b.data.date) - toTime(a.data.date));
    }
    return grouped;
  });

  eleventyConfig.addFilter("readableDate", (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  });

  eleventyConfig.addFilter("excerpt", (content, len = 160) => {
    const plain = (content || "").replace(/<[^>]+>/g, "").trim();
    return plain.length > len ? plain.slice(0, len).trim() + "…" : plain;
  });

  // Prevents multiple <h1> tags on a page: shifts every heading found
  // inside an article's body down one level (h1->h2, h2->h3, etc.),
  // so the page's own title stays the only real <h1>.
  eleventyConfig.addFilter("demoteHeadings", (html) => {
    if (!html) return html;
    return html.replace(/<(\/?)h([1-6])(\s[^>]*)?>/gi, (match, slash, level, attrs) => {
      const newLevel = Math.min(6, parseInt(level, 10) + 1);
      return `<${slash}h${newLevel}${attrs || ""}>`;
    });
  });
  
  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_layouts",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
