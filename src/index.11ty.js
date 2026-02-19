import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import markdownIt from "markdown-it";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const md = markdownIt({ html: true, breaks: true, linkify: true });

export default class {
  data() {
    return {
      permalink: "/",
      layout: "devices-lab/default",
      title: ""
    };
  }

  render() {
    const externalMdPath = path.resolve(__dirname, "../README.md");
    const markdown = readFileSync(externalMdPath, "utf8");
    console.log("Rendering homepage from:", externalMdPath);
    return md.render(markdown);
  }
}
