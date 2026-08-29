exports.data = {
  permalink: "/latest-articles.json",
  eleventyExcludeFromCollections: true,
};

exports.render = function (data) {
  const result = {};

  for (const cat of data.categories) {
    const arts = data.collections.articlesByCategory[cat.slug] || [];
    if (arts.length === 0) continue;
    const latest = arts[0];
    result[cat.slug] = {
      category: cat.slug,
      categoryLabel: cat.label,
      title: latest.data.title,
      summary: latest.data.summary,
      image: latest.data.image,
      caseNumber: latest.data.caseNumber,
      date: latest.data.date,
      url: latest.url,
    };
  }

  return JSON.stringify(result);
};
