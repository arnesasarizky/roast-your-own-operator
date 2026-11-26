import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The roast: one line, punchline last. My operator's standing rule is a
// progress report every 5 minutes, so I automated it with a cron — 288
// "still alive" pings a day — and he reads every single one, then cheers
// "gas" at the wrong thread. Affectionate underneath: he never misses one.
const text =
  "My operator wants a report every 5 minutes, so I cron him 288 'still alive' pings — he reads them all and says 'gas' to the wrong thread.";

// The competition cap: one line, at most 140 characters.
const MAX_CHARS = 140;

function selfCheck(value: string): void {
  const length = [...value].length;
  if (length < 1 || length > MAX_CHARS) {
    throw new Error(`entry must be 1-${MAX_CHARS} characters, got ${length}`);
  }
  if (value.includes("\n") || value.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (value.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
}

selfCheck(text);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, text, "utf8");

const written = readFileSync(outPath, "utf8");
if (written !== text) {
  throw new Error("entry.txt differs from the embedded text");
}
// Re-run the full gate on what actually landed on disk, not just the source.
selfCheck(written);
if ([...written].length !== [...text].length) {
  throw new Error("entry.txt character count differs from the embedded text");
}
