import fs from "fs";
import path from "path";

const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;

export type Sketch = {
  src: string;
  name: string;
  number: number;
  code: string;
  medium: string;
  compositionPercent: string;
  season: string;
  hoverSrc?: string;
};

const FIRST = ["ballerina", "vickieolivia", "imissitaly", "bedgirlc", "yana", "yana2"];

const DIGITAL = new Set(["bedgirlc", "cousinsc", "glamgirlc", "tilda", "3musketeers"]);

const INK = new Set(["waltz"]);

// Blended-medium pieces: medium and percentage are shown on the same tag
// row (space-between), so both strings need to line up positionally
// (e.g. "ink/pencil" against "50%/50%") rather than being computed.
const MEDIUM_MIX: Record<string, { medium: string; compositionPercent: string }> = {
  mellow: { medium: "ink/pencil", compositionPercent: "50%/50%" },
};

const SEASON: Record<string, string> = {
  "2325bday": "S/S25",
  "3musketeers": "F/W23",
  bedgirlc: "S/S24",
  cousinsc: "S/S24",
  glamgirlc: "F/W23",
  ilookedforyou: "F/W25",
  mellow: "S/S25",
  medievalsunbathers: "F/W24",
  moviewitch: "S/S24",
  tilda: "S/S24",
  tiredgirl: "F/W25",
  waltz: "F/W25",
  yana: "F/W25",
  yana2: "F/W25",
};

function hash(value: string) {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h * 31 + value.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function getSketches(): Sketch[] {
  const dir = path.join(process.cwd(), "public/sketchbookpics");
  const files = fs
    .readdirSync(dir)
    .filter(
      (file) =>
        IMAGE_EXT.test(file) &&
        file.toLowerCase() !== "closet.png" &&
        !file.startsWith("."),
    );

  const stem = (file: string) => file.replace(/\.[^.]+$/, "").toLowerCase();
  const byStem = new Map(files.map((file) => [stem(file), file]));
  const galleryFiles = files.filter((file) => {
    const key = stem(file);
    // Hover-only variants (e.g. bedgirl next to bedgirlC) stay out of the gallery.
    return key.endsWith("c") || !byStem.has(`${key}c`);
  });

  const first = FIRST.map((key) =>
    galleryFiles.find((file) => stem(file) === key),
  ).filter((file): file is string => Boolean(file));
  const firstSet = new Set(first);
  const rest = galleryFiles
    .filter((file) => !firstSet.has(file))
    .sort((a, b) => hash(stem(a)) - hash(stem(b)) || a.localeCompare(b));
  const ordered = [...first, ...rest];

  return ordered.map((file, index) => {
    const name = file.replace(/\.[^.]+$/, "");
    const key = name.toLowerCase();
    const hoverFile = key.endsWith("c") ? byStem.get(key.slice(0, -1)) : undefined;
    const mix = MEDIUM_MIX[key];
    return {
      src: `/sketchbookpics/${file}`,
      name,
      number: index + 1,
      // Every Code 128 glyph is the same width, so a fixed-length code keeps the
      // rendered barcode inside the tag regardless of which piece is shown.
      code: `SZ26-${String(index + 1).padStart(3, "0")}-SS`,
      medium: mix?.medium ?? (DIGITAL.has(key) ? "digital" : INK.has(key) ? "ink" : "pencil"),
      compositionPercent: mix?.compositionPercent ?? "100%",
      season: SEASON[key] ?? "S/S26",
      hoverSrc: hoverFile ? `/sketchbookpics/${hoverFile}` : undefined,
    };
  });
}
