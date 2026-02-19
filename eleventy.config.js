import userDocBase from "@devices-lab/user-doc-base";
import file from "node:fs";

export default async function (eleventyConfig, options = {}) {
  eleventyConfig.addGlobalData("site", JSON.parse(file.readFileSync("./package.json", "utf-8")));

  // Register user-doc-base plugin with this project's input dir
  await userDocBase(eleventyConfig, { inputDir: "src", syncChanges: true });

  // Also include our root README.md as the homepage content, rendered with the default layout.
  eleventyConfig.addWatchTarget("README.md");

  // Pass through image assets
  eleventyConfig.addPassthroughCopy("**/*.png");
  eleventyConfig.addPassthroughCopy("**/*.jpg");
  eleventyConfig.addPassthroughCopy("**/*.jpeg");

  return {
    dir: {
      input: "src",
      output: "_site",
      layouts: "_layouts", // Standard layouts dir (will be populated by plugin)
    },
    templateFormats: ["md", "njk", "html", "css", "11ty.js"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
