import { categories, products, type CategorySlug, type Product } from "./skycart-data";

export type Token = { value: string; kind: string };

const typeMap: Array<{ words: string[]; type: string; category: CategorySlug }> = [
  { words: ["drill", "drills"], type: "Drill", category: "power-tools" },
  { words: ["hammer", "rotary"], type: "Rotary hammer", category: "power-tools" },
  { words: ["grinder", "grinders"], type: "Angle grinder", category: "power-tools" },
  { words: ["wire", "wires", "cable", "cables"], type: "Wire", category: "wires-cables" },
  { words: ["mcb", "rccb", "breaker"], type: "MCB", category: "electrical" },
  { words: ["switch", "socket"], type: "Switch", category: "electrical" },
  { words: ["led", "batten", "light", "lighting", "floodlight", "bulb"], type: "LED luminaire", category: "lighting" },
  { words: ["pipe", "pipes", "fitting", "fittings", "pvc", "upvc"], type: "Pipe", category: "plumbing" },
  { words: ["helmet", "gloves", "harness"], type: "Safety product", category: "safety" },
  { words: ["cement"], type: "Cement", category: "construction-supplies" },
  { words: ["bolt", "bolts", "anchor", "screw", "fastener"], type: "Fastener", category: "fasteners" },
  { words: ["spanner", "kit", "plier", "tool"], type: "Hand tool", category: "hand-tools" },
  { words: ["bearing"], type: "Bearing", category: "industrial-supplies" },
  { words: ["pump", "motor"], type: "Pump", category: "pumps-motors" },
  { words: ["primer", "paint", "adhesive", "sealant"], type: "Paint & adhesive", category: "paint-adhesives" },
  { words: ["lubricant", "spray", "cleaner"], type: "Maintenance product", category: "cleaning-maintenance" },
  { words: ["lock", "hinge", "channel", "handle"], type: "Hardware", category: "hardware" },
];

export type Interpretation = {
  tokens: Token[];
  category?: CategorySlug | undefined;
  brand?: string | undefined;
  typeWords?: string[] | undefined;
};

export function interpret(query: string): Interpretation {
  const q = query.toLowerCase();
  const tokens: Token[] = [];
  let category: CategorySlug | undefined;
  let typeWords: string[] | undefined;

  const sqmm = q.match(/(\d+(?:\.\d+)?)\s*(?:sq\s*mm|sqmm|mm2)/);
  if (sqmm) tokens.push({ value: `${sqmm[1]} sq mm`, kind: "Cable size" });

  const volts = q.match(/(\d+(?:\.\d+)?)\s*v\b/);
  if (volts) tokens.push({ value: `${volts[1]} V`, kind: "Voltage" });

  const amps = q.match(/(\d+(?:\.\d+)?)\s*a\b/);
  if (amps) tokens.push({ value: `${amps[1]} A`, kind: "Current rating" });

  const watts = q.match(/(\d+(?:\.\d+)?)\s*w\b/);
  if (watts) tokens.push({ value: `${watts[1]} W`, kind: "Wattage" });

  const mm = q.match(/(\d+(?:\.\d+)?)\s*mm\b(?!2)/);
  if (mm && !sqmm) tokens.push({ value: `${mm[1]} mm`, kind: "Diameter" });

  const hp = q.match(/(\d+(?:\.\d+)?)\s*hp\b/);
  if (hp) tokens.push({ value: `${hp[1]} HP`, kind: "Power" });

  const kelvin = q.match(/(\d{4})\s*k\b/);
  if (kelvin) tokens.push({ value: `${kelvin[1]} K`, kind: "Colour temperature" });

  for (const entry of typeMap) {
    if (entry.words.some((w) => q.includes(w))) {
      tokens.push({ value: entry.type, kind: "Product type" });
      category = entry.category;
      typeWords = entry.words;
      break;
    }
  }

  const brand = [...new Set(products.map((x) => x.brand))].find((b) =>
    q.includes(b.toLowerCase().split(" ")[0] ?? b.toLowerCase()),
  );
  if (brand) tokens.push({ value: brand, kind: "Brand" });

  if (!category) {
    const cat = categories.find((c) => q.includes(c.name.toLowerCase().split(" ")[0] ?? c.name.toLowerCase()));
    if (cat) category = cat.slug;
  }

  return { tokens, category, brand, typeWords };
}

function score(product: Product, query: string, interpretation: Interpretation) {
  const q = query.toLowerCase();
  const haystack = `${product.brand} ${product.name} ${product.specLine} ${product.category}`.toLowerCase();
  let s = 0;
  if (interpretation.category === product.category) s += 6;
  if (interpretation.brand === product.brand) s += 5;
  for (const token of interpretation.tokens) {
    if (haystack.includes(token.value.toLowerCase().replace(/\s+/g, " "))) s += 4;
    const numeric = token.value.split(" ")[0];
    if (numeric && haystack.includes(numeric)) s += 2;
  }
  for (const word of q.split(/\s+/).filter((w) => w.length > 2)) {
    if (haystack.includes(word)) s += 2;
  }
  return s;
}

const squash = (x: string) => x.toLowerCase().replace(/\s+/g, "");

/** A product matches only when it satisfies every understood spec, type and brand. */
function matchesAll(product: Product, interpretation: Interpretation) {
  const haystack = `${product.brand} ${product.name} ${product.specLine} ${product.specs.map((x) => x.value).join(" ")}`;
  const flat = squash(haystack);
  const lower = haystack.toLowerCase();
  return interpretation.tokens.every((token) => {
    if (token.kind === "Brand") return product.brand === token.value;
    if (token.kind === "Product type") {
      return (
        product.category === interpretation.category &&
        (interpretation.typeWords ?? []).some((w) => new RegExp(`\\b${w}\\b`).test(lower))
      );
    }
    return flat.includes(squash(token.value));
  });
}

export function searchProducts(query: string) {
  const interpretation = interpret(query);
  if (!query.trim()) return { interpretation, results: products, related: [] as Product[], exact: true };
  const ranked = products
    .map((product) => ({ product, s: score(product, query, interpretation) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.product);
  const strict = interpretation.tokens.length > 0;
  const results = strict ? ranked.filter((p) => matchesAll(p, interpretation)) : ranked;
  const related = strict ? ranked.filter((p) => !results.includes(p)).slice(0, 6) : [];
  return { interpretation, results, related, exact: results.length > 0 };
}

export function relaxedResults(interpretation: Interpretation) {
  if (!interpretation.category) return products.slice(0, 8);
  return products.filter((x) => x.category === interpretation.category);
}

export const searchExamples = ["18V drill", "2.5 sq mm wire", "32A MCB", "20W LED", "25mm PVC pipe"];

export const suggestionsFor = (query: string) => {
  const q = query.toLowerCase().trim();
  if (!q) return searchExamples;
  const pool = [
    ...products.map((x) => `${x.brand} ${x.name}`),
    ...categories.map((c) => c.name),
    ...searchExamples,
  ];
  return pool.filter((s) => s.toLowerCase().includes(q)).slice(0, 7);
};
