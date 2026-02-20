import userDocBase from "@devices-lab/user-doc-base";
import file from "node:fs";
import path from "node:path";
import { readFileSync, writeFileSync } from "node:fs";

export default async function (eleventyConfig, options = {}) {
  const siteData = JSON.parse(file.readFileSync("./package.json", "utf-8"));

  // Register user-doc-base plugin with this project's input dir
  await userDocBase(eleventyConfig, { inputDir: "src", syncChanges: false });

  // Copy the root README.md to src/index.md, so that it can be rendered as the homepage content.
  eleventyConfig.on("eleventy.before", () => {
    const readmePath = path.resolve("README.md");
    const indexPath = path.resolve("src/index.md");

    if (!file.existsSync(indexPath)) {
      const markdown = readFileSync(readmePath, "utf8");
      writeFileSync(
        indexPath,
        [
          "---",
          `layout: "devices-lab/default"`,
          `title: "${siteData.name || "Documentation"}"`,
          `description: "${siteData.description || ""}"`,
          "---",
          "",
          markdown,
        ].join("\n"),
      );
    }
    else {
      console.warn("[WARN]\tsrc/index.md already exists, skipping copying README.md to src/index.md");
    }
  });

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
    templateFormats: ["md", "njk", "html", "css"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}