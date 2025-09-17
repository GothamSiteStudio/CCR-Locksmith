module.exports = function(eleventyConfig) {
  // Copy static assets without processing
  eleventyConfig.addPassthroughCopy({ "assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "images": "images" });

  // Blog posts collection (all Markdown under blog/posts), newest first
  eleventyConfig.addCollection("posts", (collection) =>
    collection.getFilteredByGlob("blog/posts/**/*.md").sort((a, b) => b.date - a.date)
  );

  return {
    dir: {
      input: ".",
      includes: "partials",
      output: "_site",
    },
    // Only process njk + md so existing .html files are copied as-is
    templateFormats: ["njk", "md"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};

