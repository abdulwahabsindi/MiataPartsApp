#!/usr/bin/env node
// Assembles dist/index.html from src/ and data/, and copies the images beside
// it. The data blocks the page needs are serialised from data/*.json here, so
// the shipped page cannot drift from the catalogue. Netlify runs this as its
// build command; run it locally before looking at the site.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "src");
const DATA = path.join(ROOT, "data");
const DIST = path.join(ROOT, "dist");

const readData = f => JSON.parse(fs.readFileSync(path.join(DATA, f), "utf8"));
const readSrc = p => fs.readFileSync(path.join(SRC, p), "utf8").replace(/\n$/, "");

const PARTS = readData("parts.json");
const N = readData("notes.json");
const IMG = readData("images.json");
const CAT_AR = readData("categories.json");
const FAQ = readData("faq.json");
const { vendors: VENDORS, vmap: VMAP } = readData("vendors.json");
const { ksa: KSA, intl: INTL } = readData("sources.json");
const T = readData("ui-strings.json");

// A "</script>" or "<!--" inside a string would end the block early, and
// U+2028/U+2029 are line terminators to some parsers. Escaping "<" covers the
// first two; the escapes are invisible once the browser parses the string.
const U = n => String.fromCharCode(n);
const SEPS = new RegExp("[" + U(0x2028) + U(0x2029) + "]", "g");
const literal = v => JSON.stringify(v)
  .replace(/</g, "\\u003C")
  .replace(SEPS, c => "\\u" + c.charCodeAt(0).toString(16));

const decl = (name, value) => `const ${name}=${literal(value)};`;
const block = (...lines) => `<script>\n${lines.join("\n")}\n</script>`;

// Grouped as the hand-written page grouped them, so the two stay diffable.
const DATA_BLOCKS = [
  block(decl("KSA", KSA), decl("INTL", INTL), "", decl("VENDORS", VENDORS), decl("VMAP", VMAP)),
  block(decl("PARTS", PARTS)),
  block(decl("IMG", IMG)),
  block(decl("N", N)),
  block(decl("CAT_AR", CAT_AR), decl("FAQ", FAQ), decl("T", T)),
].join("\n\n");

// Concatenated into one classic script, not ES modules: the page ships as a
// single file with no extra requests, and every top-level name stays in the
// one scope the render logic already assumes. Order is load-bearing.
const JS_FILES = ["sources.js", "format.js", "state.js", "render.js", "drawer.js", "main.js"];

// The list is the build order, so it cannot be derived from the directory. Fail
// on a file that is present and unlisted: it would be dropped from the page
// silently.
const onDisk = fs.readdirSync(path.join(SRC, "js")).filter(f => f.endsWith(".js")).sort();
const listed = [...JS_FILES].sort();
if (onDisk.join() !== listed.join()) {
  const unlisted = onDisk.filter(f => !listed.includes(f));
  const missing = listed.filter(f => !onDisk.includes(f));
  if (unlisted.length) console.error(`FAIL — src/js/ has files JS_FILES does not list: ${unlisted.join(", ")}`);
  if (missing.length) console.error(`FAIL — JS_FILES lists files not in src/js/: ${missing.join(", ")}`);
  process.exit(1);
}

// Compile each file, then the concatenation, without running either. A syntax
// error would otherwise reach the page, which loads blank with nothing in the
// build output to say why. Per file first, so the error names the file.
const compile = (code, filename) => {
  try {
    new vm.Script(code, { filename });
  } catch (err) {
    console.error(`FAIL — ${filename} does not parse: ${err.message}`);
    process.exit(1);
  }
};

const SOURCES = JS_FILES.map(f => [`src/js/${f}`, readSrc(path.join("js", f))]);
for (const [filename, code] of SOURCES) compile(code, filename);

const JS = SOURCES.map(([, code]) => code).join("\n\n");
compile(JS, "src/js/ (concatenated)");

const SLOTS = {
  CSS_BASE: readSrc(path.join("styles", "base.css")),
  CSS_APP: readSrc(path.join("styles", "app.css")),
  DATA: DATA_BLOCKS,
  JS,
};

let page = readSrc("page.html");
for (const [name, value] of Object.entries(SLOTS)) {
  const slot = `{{${name}}}`;
  if (!page.includes(slot)) {
    console.error(`FAIL — src/page.html has no ${slot} slot.`);
    process.exit(1);
  }
  // Function replacement: "$&" and friends in CSS or JS are literal here.
  page = page.replace(slot, () => value);
}
const left = page.match(/\{\{[A-Z_]+\}\}/);
if (left) {
  console.error(`FAIL — src/page.html has an unfilled slot: ${left[0]}`);
  process.exit(1);
}
page += "\n";

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(path.join(DIST, "data"), { recursive: true });
fs.writeFileSync(path.join(DIST, "index.html"), page);
fs.cpSync(path.join(DATA, "images"), path.join(DIST, "data", "images"), { recursive: true });

const images = fs.readdirSync(path.join(DIST, "data", "images")).length;
const kb = n => `${(n / 1024).toFixed(1)} KB`;
console.log(`\ndist/index.html  ${kb(Buffer.byteLength(page))}  ${page.split("\n").length} lines`);
console.log(`dist/data/images  ${images} files`);
console.log(`\nPASS — dist/ built from ${JS_FILES.length} js files and 8 data files.`);
