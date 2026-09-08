# data-contract.md

Holds: the shape of every catalogue record.
Write when: a field is added, removed, renamed or changes type, or a validation
rule changes.
Never goes in: the data itself, counts, coverage, Firestore fields, example
records longer than one line, prose about why a field exists.
Ceiling: 6500 characters.

---

## Record types

| Type | Const | Location |
|---|---|---|
| part | PARTS | `index.html` |
| note | N | `index.html` |
| vendor | VENDORS, VMAP | `index.html` |
| source | KSA, INTL | `index.html` |
| category | CAT_AR | `index.html` |
| faq-question | FAQ | `index.html` |
| ui-strings | T | `index.html` |
| image | IMG | `index.html` |

## Part

PARTS. Array of objects.

| Field | Type | Rule |
|---|---|---|
| id | string | `NC-<SYSTEM>-<DETAIL>`, uppercase, hyphenated |
| cat | string | Category key, English, must exist in CAT_AR |
| en | string | Part name, English |
| ar | string | Part name, Arabic |
| fit | string | Fitment, English only |
| oem | string | Current Mazda part number |
| sup | string | Comma-separated superseded numbers, newest first, may be empty |
| rows | array | Cross-reference rows |

### id

- Permanent once shipped.
- Firestore posts target a part by id. Renaming one orphans every post against it.

### fit

- Precedence: build date, then model year, then trim, then brake package.
- A part that splits into an earlier and a later car carries the split date in
  `fit` on both records. Not in the note.

### oem and sup

- `oem` is the current Mazda number.
- `sup` is what it replaced, newest first.
- A number never moves from `sup` back to `oem`.

### rows

Positional tuple, 6 elements.

| Index | Name | Values |
|---|---|---|
| 0 | kind | `O` Mazda part, `A` alternative. Exactly one `O` per part |
| 1 | brand | string |
| 2 | num | string, may hold two numbers separated by ` / ` |
| 3 | type | `OEM` on the O row, `Direct` on A rows. No other value in use |
| 4 | ksa | Index into KSA, or -1 |
| 5 | intl | Index into INTL, or -1 |

## Note

N. Object keyed by part id. Every part id must be present.
`N[id].en` and `N[id].ar` are both required and carry the same three fields.

| Field | Type | Holds |
|---|---|---|
| i | string | Interval text |
| w | string | Why it gets replaced, one paragraph |
| p | array | Symptom strings |

## Vendor

VENDORS. Array.

| Field | Type | Holds |
|---|---|---|
| k | string | Vendor key, lowercase, permanent |
| en | string | Name, English |
| ar | string | Name, Arabic |
| tEn | string | Vendor type, English |
| tAr | string | Vendor type, Arabic |
| u | string | URL, may be empty |
| p | string | Phone, may be empty |
| dEn | string | Description, English, may be empty |
| dAr | string | Description, Arabic, may be empty |

VMAP. Array of `[substring, vendor key]`.

- Matched lowercase, first match wins.
- Resolves a source string to a vendor.

## Source

- KSA: 9 entries. INTL: 8 entries.
- Arrays of comma-separated vendor name strings.
- Addressed by index from `rows[4]` and `rows[5]`.

## Category

- CAT_AR. Object mapping the English category key to its Arabic name.
- Category keys carry a ` / ` separator for subcategories.

## FAQ question

- FAQ. Array of `{en, ar}`.
- Questions only. No id. No answers.

## UI strings

- T. Object keyed by `en` and `ar`, same key set in both.
- Values are strings, or functions of `(n, t)`.
- `dir` holds `ltr` or `rtl`.

## Image

IMG. Object keyed by part id.

| Field | Type | Holds |
|---|---|---|
| t | string | Thumbnail, base64 data URI |
| f | string | Full image, base64 data URI |

## Validation rules

Not implemented.

- Part ids are unique and match `NC-<SYSTEM>-<DETAIL>`.
- No shipped part id changes between runs.
- Every PARTS id appears in N and IMG. No extras in either.
- Every N entry has both `en` and `ar`, all three fields non-empty.
- Every part has exactly one row with kind `O`.
- Every A row has type `Direct`. No other value is valid.
- No number appears in both `oem` and `sup` on the same record.
- `rows[4]` and `rows[5]` are -1 or a valid index into KSA and INTL.
- Every part `cat` exists in CAT_AR.
- Every VMAP key exists in VENDORS.
- Every source string resolves to a vendor via VMAP, or is flagged.
- `T.en` and `T.ar` have identical key sets.
