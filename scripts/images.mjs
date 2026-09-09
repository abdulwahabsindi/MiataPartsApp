#!/usr/bin/env node
// Normalises data/images.json. A value may be a `data:image/webp;base64,...`
// URI (a newly added image) or an existing `data/images/<hash>.webp` path; either
// way the bytes are written to a content-addressed file and the record is
// rewritten to { src, w, h }. Identical images share one file.
// Idempotent: run it after adding an image, then run validate.mjs.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";

const SRC = new URL("../data/images.json", import.meta.url);
const DIR = new URL("../data/images/", import.meta.url);

// Intrinsic size from a WebP container: simple (VP8), lossless (VP8L) or
// extended (VP8X). Needed so the markup can reserve the box before load.
function webpSize(b) {
  if (b.toString("ascii", 0, 4) !== "RIFF" || b.toString("ascii", 8, 12) !== "WEBP")
    throw new Error("not a WebP file");
  const fourcc = b.toString("ascii", 12, 16);
  if (fourcc === "VP8 ")
    return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
  if (fourcc === "VP8L") {
    const n = b.readUInt32LE(21);
    return { w: (n & 0x3fff) + 1, h: ((n >> 14) & 0x3fff) + 1 };
  }
  if (fourcc === "VP8X")
    return { w: (b.readUIntLE(24, 3) & 0xffffff) + 1, h: (b.readUIntLE(27, 3) & 0xffffff) + 1 };
  throw new Error(`unknown WebP chunk ${fourcc}`);
}

const img = JSON.parse(readFileSync(SRC, "utf8"));
mkdirSync(DIR, { recursive: true });

const written = new Set();
const out = {};

for (const [id, rec] of Object.entries(img)) {
  out[id] = {};
  for (const size of ["t", "f"]) {
    const v = rec[size];
    if (v === undefined) continue;
    const value = typeof v === "string" ? v : v.src;
    let buf;
    const m = /^data:image\/webp;base64,(.+)$/s.exec(value ?? "");
    if (m) buf = Buffer.from(m[1], "base64");
    else if (/^data\/images\/[0-9a-f]{12}\.webp$/.test(value ?? ""))
      buf = readFileSync(new URL(value.slice("data/images/".length), DIR));
    else {
      console.error(`${id}.${size}: expected a webp data URI or data/images/<hash>.webp`);
      process.exit(1);
    }
    const name = `${createHash("sha256").update(buf).digest("hex").slice(0, 12)}.webp`;
    if (!written.has(name)) {
      writeFileSync(new URL(name, DIR), buf);
      written.add(name);
    }
    out[id][size] = { src: `data/images/${name}`, ...webpSize(buf) };
  }
}

writeFileSync(SRC, JSON.stringify(out, null, 2) + "\n");
console.log(`${Object.keys(out).length} records -> ${written.size} files`);
