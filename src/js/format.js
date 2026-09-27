// count and alts take a number and build a phrase, so they are code, not
// strings. Keeping them out of ui-strings.json leaves that file pure strings
// and its en/ar key parity check meaningful.
T.en.count=(n,t)=>n===t?`${t} parts`:`${n} of ${t} parts`;
T.ar.count=(n,t)=>n===t?`${t} قطعة`:`${n} من ${t} قطعة`;
T.en.alts=n=>`${n} alternative${n===1?"":"s"}`;
T.ar.alts=n=>`${n} بديل`;
