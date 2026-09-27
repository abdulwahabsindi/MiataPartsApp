#!/usr/bin/env node
// Validates the catalogue in data/ against the data contract, regenerates
// project/catalogue.md on success, and lints the project/ datasheets.
// Exit 0 = pass, 1 = fail. Run before shipping any part change.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA = path.join(ROOT, "data");
const GEN_DATE = "2026-09-08";

const read = f => JSON.parse(fs.readFileSync(path.join(DATA, f), "utf8"));
const PARTS = read("parts.json");
const N = read("notes.json");
const IMG = read("images.json");
const CAT_AR = read("categories.json");
const FAQ = read("faq.json");
const { vendors: VENDORS, vmap: VMAP } = read("vendors.json");
const { ksa: KSA, intl: INTL } = read("sources.json");
const T = read("ui-strings.json");

const errors = [];
const warnings = [];
const err = m => errors.push(m);
const warn = m => warnings.push(m);

// ---------------------------------------------------------------- part rules
// NC- followed by one or more uppercase segments. Contract writes it as
// NC-<SYSTEM>-<DETAIL>, but shipped ids like NC-PCV carry a single segment
// and are permanent, so a single segment is accepted.
const ID_RE = /^NC(?:-[A-Z0-9]+)+$/;
const partIds = PARTS.map(p => p.id);

const seen = new Set();
for (const id of partIds) {
  if (!ID_RE.test(id)) err(`part id malformed: ${id}`);
  if (seen.has(id)) err(`duplicate part id: ${id}`);
  seen.add(id);
}

for (const p of PARTS) {
  // exactly one O row; A rows are Direct
  const oRows = p.rows.filter(r => r[0] === "O");
  if (oRows.length !== 1) err(`${p.id}: expected exactly one O row, found ${oRows.length}`);
  for (const r of p.rows) {
    if (r[0] === "A" && r[3] !== "Direct") err(`${p.id}: A row "${r[1]}" has type "${r[3]}", expected Direct`);
    if (!["O", "A"].includes(r[0])) err(`${p.id}: row kind "${r[0]}" invalid`);
    // rows[4]/rows[5]: -1 or valid index into KSA/INTL
    const [ , , , , ksaIdx, intlIdx] = r;
    if (ksaIdx !== -1 && !(Number.isInteger(ksaIdx) && ksaIdx >= 0 && ksaIdx < KSA.length))
      err(`${p.id}: row "${r[1]}" ksa index ${ksaIdx} out of range 0..${KSA.length - 1}`);
    if (intlIdx !== -1 && !(Number.isInteger(intlIdx) && intlIdx >= 0 && intlIdx < INTL.length))
      err(`${p.id}: row "${r[1]}" intl index ${intlIdx} out of range 0..${INTL.length - 1}`);
  }
  // cat exists in CAT_AR
  if (!(p.cat in CAT_AR)) err(`${p.id}: category "${p.cat}" not in categories.json`);
  // no number appears in both oem and sup
  const sups = (p.sup || "").split(",").map(s => s.trim()).filter(Boolean);
  if (sups.includes(p.oem.trim())) err(`${p.id}: oem "${p.oem}" also appears in sup`);
  // required string fields
  for (const f of ["en", "ar", "fit", "oem"]) {
    if (typeof p[f] !== "string" || !p[f].trim()) err(`${p.id}: field "${f}" empty`);
  }
}

// ---------------------------------------------------------------- note rules
const idSet = new Set(partIds);
const noteIds = new Set(Object.keys(N));
const imgIds = new Set(Object.keys(IMG));

for (const id of partIds) {
  if (!noteIds.has(id)) err(`note missing for part ${id}`);
  if (!imgIds.has(id)) err(`image missing for part ${id}`);
}
for (const id of noteIds) if (!idSet.has(id)) err(`note has no matching part: ${id}`);
for (const id of imgIds) if (!idSet.has(id)) err(`image has no matching part: ${id}`);

for (const [id, rec] of Object.entries(IMG)) {
  for (const size of ["t", "f"]) {
    const v = rec[size];
    if (!v || typeof v !== "object" || !/^data\/images\/[0-9a-f]{12}\.webp$/.test(v.src))
      err(`image ${id}.${size}: expected { src: "data/images/<hash>.webp", w, h }`);
    else if (!fs.existsSync(path.join(ROOT, v.src)))
      err(`image file missing: ${v.src} (${id}.${size})`);
    else if (!Number.isInteger(v.w) || !Number.isInteger(v.h) || v.w < 1 || v.h < 1)
      err(`image ${id}.${size}: w and h must be positive integers`);
    // The drawer reserves a fixed 240px-tall slot, which only holds without
    // upscaling while every full image is at least that tall.
    else if (size === "f" && v.h < 240)
      err(`image ${id}.f is ${v.w}x${v.h}: full images must be >= 240px tall`);
  }
}

// Files left behind by a replaced image still ship. Advisory: unreferenced
// bytes are waste, not breakage.
{
  const dir = path.join(DATA, "images");
  const referenced = new Set();
  for (const rec of Object.values(IMG))
    for (const v of Object.values(rec)) if (v && v.src) referenced.add(path.basename(v.src));
  for (const f of fs.existsSync(dir) ? fs.readdirSync(dir) : [])
    if (!referenced.has(f)) warn(`data/images/${f} is referenced by no part`);
}

for (const [id, note] of Object.entries(N)) {
  for (const lang of ["en", "ar"]) {
    if (!note[lang]) { err(`note ${id}: missing "${lang}"`); continue; }
    const { i, w, p } = note[lang];
    if (typeof i !== "string" || !i.trim()) err(`note ${id}.${lang}: interval "i" empty`);
    if (typeof w !== "string" || !w.trim()) err(`note ${id}.${lang}: why "w" empty`);
    if (!Array.isArray(p) || p.length === 0) err(`note ${id}.${lang}: symptoms "p" empty`);
    else if (p.some(s => typeof s !== "string" || !s.trim())) err(`note ${id}.${lang}: a symptom is empty`);
  }
}

// -------------------------------------------------------------- vendor rules
const vendorKeys = new Set(VENDORS.map(v => v.k));
for (const [sub, key] of VMAP) if (!vendorKeys.has(key)) err(`vmap "${sub}" -> "${key}" not in vendors`);

// every source string resolves to a vendor via VMAP (first substring match), or is flagged
const resolves = s => VMAP.some(([sub]) => s.toLowerCase().includes(sub));
for (const [label, arr] of [["KSA", KSA], ["INTL", INTL]]) {
  arr.forEach((set, i) => set.split(",").map(x => x.trim()).filter(Boolean).forEach(item => {
    if (!resolves(item)) warn(`${label}[${i}] source "${item}" resolves to no vendor via vmap`);
  }));
}

// ------------------------------------------------------------ ui-string rules
const enKeys = Object.keys(T.en).sort();
const arKeys = Object.keys(T.ar).sort();
if (JSON.stringify(enKeys) !== JSON.stringify(arKeys)) {
  const only = (a, b) => a.filter(k => !b.includes(k));
  err(`ui-strings en/ar key sets differ: en-only=[${only(enKeys, arKeys)}] ar-only=[${only(arKeys, enKeys)}]`);
}

// ============================================================ catalogue.md gen
function generateCatalogue() {
  const rowsTotal = PARTS.reduce((a, p) => a + p.rows.length, 0);
  const oemRows = PARTS.reduce((a, p) => a + p.rows.filter(r => r[0] === "O").length, 0);
  const altRows = rowsTotal - oemRows;
  const withSup = PARTS.filter(p => (p.sup || "").trim()).length;
  const missingSup = PARTS.filter(p => !(p.sup || "").trim()).map(p => p.id);

  // categories: count desc, then name asc
  const catCounts = {};
  for (const p of PARTS) catCounts[p.cat] = (catCounts[p.cat] || 0) + 1;
  const catRows = Object.entries(catCounts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([c, n]) => `| ${c} | ${n} |`).join("\n");

  const out = `# catalogue.md

Holds: coverage and status counts for the catalogue.
Write when: never, by hand. Run the generator.
Never goes in: anything, by hand. This header included.
Ceiling: generator-bound.

---

Generated from \`data/\` by \`scripts/validate.mjs\`, ${GEN_DATE}.

## Counts

| Item | Count |
|---|---|
| Parts | ${PARTS.length} |
| Cross-reference rows | ${rowsTotal} |
| OEM rows | ${oemRows} |
| Alternative rows | ${altRows} |
| Categories | ${Object.keys(CAT_AR).length} |
| Vendors | ${VENDORS.length} |
| FAQ questions | ${FAQ.length} |
| KSA source sets | ${KSA.length} |
| INTL source sets | ${INTL.length} |

## Categories

| Category | Parts |
|---|---|
${catRows}

## Coverage

| Field | Parts |
|---|---|
| Arabic name | ${PARTS.filter(p => (p.ar || "").trim()).length} / ${PARTS.length} |
| Arabic notes | ${Object.values(N).filter(n => n.ar && (n.ar.i || "").trim()).length} / ${PARTS.length} |
| Image | ${PARTS.filter(p => imgIds.has(p.id)).length} / ${PARTS.length} |
| OEM number | ${PARTS.filter(p => (p.oem || "").trim()).length} / ${PARTS.length} |
| Superseded numbers | ${withSup} / ${PARTS.length} |

## Status

| Item | Count |
|---|---|
| Verified parts | 0 |
| Draft parts | ${PARTS.length} |

- No per-record verified flag exists. All records are draft by the site footer.

## Missing superseded data

${missingSup.map(id => `- ${id}`).join("\n")}

## Community content

| Item | Count |
|---|---|
| Posts approved | 0 |
| Posts pending | 0 |
| FAQ answered | 0 / ${FAQ.length} |
`;
  return out;
}

// ============================================================ datasheet lint
const SHEETS = ["system.md", "data-contract.md", "api-and-schema.md", "catalogue.md", "pending.md"];
function lintSheets() {
  for (const name of SHEETS) {
    const file = path.join(ROOT, "project", name);
    if (!fs.existsSync(file)) { warn(`datasheet missing: project/${name}`); continue; }
    const text = fs.readFileSync(file, "utf8");
    const lines = text.split("\n");

    // ceiling
    const m = text.match(/^Ceiling:\s*(\d+)\s*characters/m);
    if (m) {
      const cap = Number(m[1]);
      if (text.length > cap) err(`project/${name}: ${text.length} chars over ceiling ${cap}`);
    }

    // body checks: everything after the first '---'. Ceiling is a hard error
    // above; paragraph and heading drift are advisory warnings so a valid part
    // edit never fails on a datasheet-style quibble.
    const sep = lines.findIndex(l => l.trim() === "---");
    let inFence = false;
    const headingsSeen = new Set();
    const isStructural = (raw) => {
      const line = raw.trim();
      return line === "" || line.startsWith("#") || line.startsWith("|") ||
        /^[-*]\s/.test(line) || /^\d+\.\s/.test(line) || /^\s+\S/.test(raw);
    };
    // A "paragraph" is a run of 2+ consecutive non-structural lines whose
    // combined length exceeds 200 chars — real prose, not a one-line lead-in.
    let run = [];
    const flushRun = (endLine) => {
      const chars = run.reduce((a, l) => a + l.length, 0);
      if (run.length >= 2 && chars > 200)
        warn(`project/${name}:${endLine - run.length + 1}: prose paragraph in body (datasheets are tables and bullets)`);
      run = [];
    };
    for (let i = sep + 1; i < lines.length; i++) {
      const raw = lines[i];
      const line = raw.trim();
      if (line.startsWith("```")) { flushRun(i); inFence = !inFence; continue; }
      if (inFence) continue;
      if (line.startsWith("#")) {
        flushRun(i);
        if (/^#{4,}\s/.test(line)) warn(`project/${name}:${i + 1}: heading deeper than ###`);
        const key = line.replace(/^#+\s*/, "");
        if (headingsSeen.has(key)) warn(`project/${name}:${i + 1}: duplicate heading "${key}"`);
        headingsSeen.add(key);
        continue;
      }
      if (isStructural(raw)) { flushRun(i); continue; }
      run.push(line);
    }
    flushRun(lines.length);
  }
}

// ==================================================================== run
lintSheets();

if (errors.length === 0) {
  fs.writeFileSync(path.join(ROOT, "project", "catalogue.md"), generateCatalogue());
}

const pad = s => String(s);
console.log(`\nparts ${PARTS.length}  notes ${Object.keys(N).length}  images ${Object.keys(IMG).length}  vendors ${VENDORS.length}  faq ${FAQ.length}`);
if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const w of warnings) console.log(`  ⚠ ${w}`);
}
if (errors.length) {
  console.log(`\n${errors.length} error(s):`);
  for (const e of errors) console.log(`  ✗ ${e}`);
  console.log(`\nFAIL — catalogue.md not regenerated.`);
  process.exit(1);
}
console.log(`\nPASS — ${pad(errors.length)} errors. catalogue.md regenerated.`);
process.exit(0);
