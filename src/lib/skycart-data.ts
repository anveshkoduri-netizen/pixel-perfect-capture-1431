export type CategorySlug =
  | "electrical"
  | "wires-cables"
  | "lighting"
  | "plumbing"
  | "hardware"
  | "power-tools"
  | "hand-tools"
  | "safety"
  | "construction-supplies"
  | "industrial-supplies"
  | "fasteners"
  | "paint-adhesives"
  | "pumps-motors"
  | "cleaning-maintenance";

export type Category = {
  slug: CategorySlug;
  name: string;
  blurb: string;
  count: number;
  icon: string;
};

export const categories: Category[] = [
  { slug: "electrical", name: "Electrical", blurb: "MCBs, RCCBs, switches, boards", count: 4120, icon: "zap" },
  { slug: "wires-cables", name: "Wires & Cables", blurb: "FR, flexible, armoured", count: 9310, icon: "cable" },
  { slug: "lighting", name: "Lighting", blurb: "Battens, panels, floodlights", count: 12760, icon: "lightbulb" },
  { slug: "plumbing", name: "Plumbing", blurb: "Pipes, fittings, valves", count: 15240, icon: "droplets" },
  { slug: "hardware", name: "Hardware", blurb: "Hinges, locks, channels", count: 21080, icon: "wrench" },
  { slug: "power-tools", name: "Power Tools", blurb: "Drills, grinders, saws", count: 6420, icon: "drill" },
  { slug: "hand-tools", name: "Hand Tools", blurb: "Spanners, pliers, kits", count: 8730, icon: "hammer" },
  { slug: "safety", name: "Safety", blurb: "Helmets, gloves, harnesses", count: 5410, icon: "hard-hat" },
  {
    slug: "construction-supplies",
    name: "Construction Supplies",
    blurb: "Cement, admixtures, mesh",
    count: 4380,
    icon: "brick-wall",
  },
  {
    slug: "industrial-supplies",
    name: "Industrial Supplies",
    blurb: "Bearings, abrasives, MRO",
    count: 11690,
    icon: "factory",
  },
  { slug: "fasteners", name: "Fasteners", blurb: "Bolts, anchors, screws", count: 7250, icon: "bolt" },
  { slug: "paint-adhesives", name: "Paint & Adhesives", blurb: "Primers, sealants, epoxy", count: 3910, icon: "paint-roller" },
  { slug: "pumps-motors", name: "Pumps & Motors", blurb: "Monoblock, submersible", count: 2870, icon: "fan" },
  {
    slug: "cleaning-maintenance",
    name: "Cleaning & Maintenance",
    blurb: "Lubricants, wipes, solvents",
    count: 3340,
    icon: "spray-can",
  },
];

export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);

export type Product = {
  id: string;
  brand: string;
  name: string;
  category: CategorySlug;
  specLine: string;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  delivery: string;
  freeDelivery: boolean;
  stock: "in" | "low" | "out";
  unit?: string;
  tags: Array<"new" | "bestseller" | "deal" | "recommended">;
  specs: Array<{ label: string; value: string }>;
  compatibility: string[];
  included: string[];
  warranty: string;
  glance: string[];
  /** Up to three short spec tags pinned on the product photo. */
  callouts?: string[] | undefined;
  /** Large "At a glance" values; falls back to the first four specs. */
  glanceStats?: Array<{ value: string; label: string }> | undefined;
  /** Products sharing a variant group appear in one selector row on the PDP. */
  variant?: { group: string; axis: string; label: string } | undefined;
  /** Reuse another product's photo until a dedicated one exists. */
  imageOf?: string | undefined;
};

const p = (x: Product) => x;

const poleInfo = {
  SP: { name: "Single Pole", modules: "1", phase: "Single phase", voltage: "240 V" },
  DP: { name: "Double Pole", modules: "2", phase: "Single phase", voltage: "240 V" },
  TP: { name: "Triple Pole", modules: "3", phase: "Three phase", voltage: "415 V" },
  TPN: { name: "Triple Pole + Neutral", modules: "4", phase: "Three phase", voltage: "415 V" },
} as const;

function mcb(o: {
  id: string;
  brand: string;
  poles: keyof typeof poleInfo;
  curve: "B" | "C";
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  delivery: string;
  freeDelivery: boolean;
  group?: string;
  stock?: Product["stock"];
}): Product {
  const info = poleInfo[o.poles];
  return {
    id: o.id,
    brand: o.brand,
    name: `32 A ${info.name} MCB, ${o.curve} Curve`,
    category: "electrical",
    specLine: `32 A · ${o.poles} · ${o.curve} curve · 10 kA`,
    price: o.price,
    mrp: o.mrp,
    rating: o.rating,
    reviews: o.reviews,
    delivery: o.delivery,
    freeDelivery: o.freeDelivery,
    stock: o.stock ?? "in",
    tags: [],
    specs: [
      { label: "Current rating", value: "32 A" },
      { label: "Poles", value: info.name },
      { label: "Curve", value: o.curve },
      { label: "Breaking capacity", value: "10 kA" },
      { label: "Phase", value: info.phase },
      { label: "Mounting", value: "35 mm DIN rail" },
    ],
    compatibility: [`${o.brand} distribution boards`, "35 mm DIN rail", "Up to 10 sq mm conductors"],
    included: ["1 × MCB"],
    warranty: "2 year replacement warranty",
    glance: [
      o.curve === "C" ? "C curve for mixed lighting and power loads" : "B curve for resistive and lighting loads",
      "10 kA short-circuit capacity",
      "DIN rail mount",
    ],
    callouts: ["32 A", `${o.curve}-curve`, "10 kA"],
    glanceStats: [
      { value: "32 A", label: "Rated current" },
      { value: "10 kA", label: "Breaking capacity" },
      { value: info.voltage, label: "Rated voltage" },
      { value: info.modules, label: "Module width" },
    ],
    variant: o.group ? { group: o.group, axis: "Poles", label: o.poles } : undefined,
  };
}


type Base = Pick<Product, "id" | "brand" | "price" | "mrp" | "rating" | "reviews" | "delivery" | "freeDelivery"> & { stock?: Product["stock"]; tags?: Product["tags"] };
const base = (o: Base) => ({ ...o, stock: o.stock ?? ("in" as const), tags: o.tags ?? [] });

function drill(o: Base & { model: string; volts: 12 | 18 | 36; motor: "Brushless" | "Brushed"; battery: "2 × 2.0 Ah" | "2 × 4.0 Ah" | "Bare tool"; torque: number; impact?: boolean }): Product {
  const batteryType = o.battery === "Bare tool" ? "Bare tool" : `Li-ion ${o.battery.slice(4)}`;
  const kind = o.impact ? "Impact Drill" : "Drill Driver";
  return {
    ...base(o),
    name: `${o.volts}V Cordless ${kind} ${o.model}`,
    category: "power-tools",
    specLine: `${o.volts} V · ${o.motor} · ${o.battery} · ${o.torque} Nm`,
    specs: [
      { label: "Voltage", value: `${o.volts} V` },
      { label: "Motor", value: o.motor },
      { label: "Max torque", value: `${o.torque} Nm` },
      { label: "Battery type", value: batteryType },
      { label: "Chuck", value: o.volts === 12 ? "10 mm keyless" : "13 mm keyless" },
      { label: "Battery", value: o.battery === "Bare tool" ? "Not included" : `${o.battery} Li-ion` },
    ],
    compatibility: [`${o.brand} ${o.volts}V battery platform`, "Hex and round shank bits"],
    included: o.battery === "Bare tool" ? ["Drill body", "Belt clip"] : ["Drill body", `${o.battery} batteries`, "Charger", "Carry case"],
    warranty: "1 year manufacturer warranty",
    glance: [`${o.motor} motor`, `${o.torque} Nm max torque`, o.battery === "Bare tool" ? "Bare tool — uses your existing batteries" : "Batteries and charger included"],
    imageOf: "bosch-gsb-18v-50",
  };
}

function batten(o: Base & { model: string; kelvin: 3000 | 4000 | 6500; lumens: number }): Product {
  return {
    ...base(o),
    name: `20W LED Batten ${o.model}, 4 ft ${o.kelvin === 3000 ? "Warm White" : o.kelvin === 4000 ? "Natural White" : "Cool Daylight"}`,
    category: "lighting",
    specLine: `20 W · ${o.lumens.toLocaleString("en-IN")} lm · ${o.kelvin} K · IP20`,
    specs: [
      { label: "Wattage", value: "20 W" },
      { label: "Luminous flux", value: `${o.lumens.toLocaleString("en-IN")} lm` },
      { label: "Colour temperature", value: `${o.kelvin} K` },
      { label: "IP rating", value: "IP20" },
      { label: "Length", value: "1,200 mm" },
      { label: "Input", value: "140–270 V AC" },
    ],
    compatibility: ["Surface and ceiling mount", "Standard 4 ft batten brackets"],
    included: ["Batten", "Mounting clips", "Screws"],
    warranty: "2 year warranty",
    glance: [`${o.lumens.toLocaleString("en-IN")} lm output`, "Wide voltage operation", "Surge protected driver"],
    imageOf: "philips-20w-batten",
  };
}

function pipe(o: Base & { material: "UPVC" | "CPVC"; length: "3 m" | "6 m" }): Product {
  return {
    ...base(o),
    name: `25 mm ${o.material} Plumbing Pipe, ${o.length}`,
    category: "plumbing",
    specLine: `25 mm · ${o.material} · ${o.material === "CPVC" ? "SDR 11 · Hot & cold" : "Schedule 40"} · ${o.length}`,
    unit: "per length",
    specs: [
      { label: "Diameter", value: "25 mm" },
      { label: "Material", value: o.material },
      { label: "Length", value: o.length },
      { label: "Connection type", value: "Solvent weld" },
      { label: "Pressure class", value: o.material === "CPVC" ? "SDR 11" : "Schedule 40" },
      { label: "Standard", value: o.material === "CPVC" ? "IS 15778" : "IS 4985" },
    ],
    compatibility: [`25 mm ${o.material} solvent weld fittings`, `${o.material} solvent cement`],
    included: [`1 × ${o.length} pipe`],
    warranty: "Manufacturer defect replacement",
    glance: [o.material === "CPVC" ? "Rated for hot and cold water" : "Cold water rated", "Lead-free", "Solvent weld jointing"],
    imageOf: "supreme-25mm-pvc-pipe",
  };
}

const d = { delivery: "Tomorrow", freeDelivery: true };
const catalogueDepth: Product[] = [
  drill({ id: "bosch-gsr-18v-55-bare", brand: "Bosch Professional", model: "GSR 18V-55", volts: 18, motor: "Brushless", battery: "Bare tool", torque: 55, price: 6299, mrp: 8499, rating: 4.7, reviews: 188, ...d }),
  drill({ id: "makita-ddf485-18v", brand: "Makita", model: "DDF485", volts: 18, motor: "Brushless", battery: "2 × 2.0 Ah", torque: 50, price: 11490, mrp: 15900, rating: 4.8, reviews: 342, ...d, tags: ["bestseller"] }),
  drill({ id: "makita-dhp453-18v", brand: "Makita", model: "DHP453", volts: 18, motor: "Brushed", battery: "2 × 2.0 Ah", torque: 42, impact: true, price: 9290, mrp: 12400, rating: 4.6, reviews: 211, delivery: "In 2 days", freeDelivery: true }),
  drill({ id: "dewalt-dcd796-18v", brand: "DeWalt", model: "DCD796", volts: 18, motor: "Brushless", battery: "2 × 4.0 Ah", torque: 70, impact: true, price: 16990, mrp: 22500, rating: 4.8, reviews: 157, ...d, tags: ["recommended"] }),
  drill({ id: "stanley-scd711-18v", brand: "Stanley", model: "SCD711", volts: 18, motor: "Brushed", battery: "2 × 2.0 Ah", torque: 44, price: 5499, mrp: 7999, rating: 4.4, reviews: 523, delivery: "Tomorrow", freeDelivery: false, tags: ["deal"] }),
  drill({ id: "blackdecker-bcd700-18v", brand: "Black+Decker", model: "BCD700", volts: 18, motor: "Brushed", battery: "2 × 2.0 Ah", torque: 40, price: 4799, mrp: 6999, rating: 4.3, reviews: 614, delivery: "In 2 days", freeDelivery: false }),
  drill({ id: "hitachi-ds18dd-18v", brand: "Hitachi", model: "DS18DD", volts: 18, motor: "Brushed", battery: "2 × 2.0 Ah", torque: 46, price: 7390, mrp: 9800, rating: 4.5, reviews: 98, ...d, stock: "low" }),
  drill({ id: "dewalt-dcd777-18v-bare", brand: "DeWalt", model: "DCD777", volts: 18, motor: "Brushless", battery: "Bare tool", torque: 65, price: 7990, mrp: 10500, rating: 4.6, reviews: 73, delivery: "In 3 days", freeDelivery: true }),
  drill({ id: "bosch-gsr-12v-30", brand: "Bosch Professional", model: "GSR 12V-30", volts: 12, motor: "Brushless", battery: "2 × 2.0 Ah", torque: 30, price: 7499, mrp: 9999, rating: 4.7, reviews: 204, ...d }),
  drill({ id: "makita-df333d-12v", brand: "Makita", model: "DF333D", volts: 12, motor: "Brushed", battery: "2 × 2.0 Ah", torque: 30, price: 6290, mrp: 8200, rating: 4.5, reviews: 167, delivery: "In 2 days", freeDelivery: true }),
  drill({ id: "dewalt-dcd701-12v", brand: "DeWalt", model: "DCD701", volts: 12, motor: "Brushless", battery: "2 × 2.0 Ah", torque: 57, price: 9490, mrp: 12900, rating: 4.6, reviews: 88, ...d }),
  drill({ id: "bosch-gsb-36v-bare", brand: "Bosch Professional", model: "GSB 36V", volts: 36, motor: "Brushless", battery: "Bare tool", torque: 68, impact: true, price: 18990, mrp: 24900, rating: 4.7, reviews: 41, delivery: "In 3 days", freeDelivery: true }),
  drill({ id: "hitachi-ds36da-36v", brand: "Hitachi", model: "DS36DA", volts: 36, motor: "Brushless", battery: "2 × 4.0 Ah", torque: 70, price: 24500, mrp: 31000, rating: 4.6, reviews: 26, delivery: "In 3 days", freeDelivery: true, stock: "low" }),
  batten({ id: "philips-20w-batten-4000k", brand: "Philips", model: "Astra Line", kelvin: 4000, lumens: 2000, price: 679, mrp: 999, rating: 4.5, reviews: 640, ...d }),
  batten({ id: "syska-20w-batten", brand: "Syska", model: "T5 Slim", kelvin: 6500, lumens: 1900, price: 449, mrp: 799, rating: 4.3, reviews: 1180, delivery: "Tomorrow", freeDelivery: false, tags: ["deal"] }),
  batten({ id: "syska-20w-batten-3000k", brand: "Syska", model: "T5 Slim", kelvin: 3000, lumens: 1800, price: 459, mrp: 799, rating: 4.2, reviews: 312, delivery: "In 2 days", freeDelivery: false }),
  batten({ id: "wipro-20w-batten", brand: "Wipro", model: "Garnet", kelvin: 6500, lumens: 2000, price: 529, mrp: 890, rating: 4.4, reviews: 905, ...d }),
  batten({ id: "wipro-20w-batten-4000k", brand: "Wipro", model: "Garnet", kelvin: 4000, lumens: 1950, price: 539, mrp: 890, rating: 4.4, reviews: 221, delivery: "In 2 days", freeDelivery: true }),
  batten({ id: "havells-20w-batten", brand: "Havells", model: "Pearl", kelvin: 6500, lumens: 2200, price: 599, mrp: 1050, rating: 4.5, reviews: 734, ...d, tags: ["recommended"] }),
  pipe({ id: "astral-25mm-cpvc-pipe", brand: "Astral", material: "CPVC", length: "3 m", price: 412, mrp: 520, rating: 4.6, reviews: 388, ...d }),
  pipe({ id: "astral-25mm-upvc-pipe", brand: "Astral", material: "UPVC", length: "6 m", price: 405, mrp: 510, rating: 4.5, reviews: 196, delivery: "In 2 days", freeDelivery: false }),
  pipe({ id: "finolex-25mm-upvc-pipe", brand: "Finolex", material: "UPVC", length: "3 m", price: 209, mrp: 270, rating: 4.4, reviews: 251, delivery: "In 2 days", freeDelivery: false }),
  pipe({ id: "finolex-25mm-cpvc-pipe", brand: "Finolex", material: "CPVC", length: "3 m", price: 398, mrp: 505, rating: 4.5, reviews: 144, ...d }),
  pipe({ id: "ashirvad-25mm-cpvc-pipe", brand: "Ashirvad", material: "CPVC", length: "3 m", price: 425, mrp: 540, rating: 4.7, reviews: 302, ...d, tags: ["bestseller"] }),
  pipe({ id: "supreme-25mm-cpvc-pipe", brand: "Supreme", material: "CPVC", length: "6 m", price: 789, mrp: 990, rating: 4.4, reviews: 87, delivery: "In 3 days", freeDelivery: true }),
];

export const products: Product[] = [
  p({
    id: "bosch-gsb-18v-50",
    brand: "Bosch Professional",
    name: "18V Cordless Impact Drill GSB 18V-50",
    category: "power-tools",
    specLine: "18 V · Brushless · 2 × 2.0 Ah",
    price: 8499,
    mrp: 12999,
    rating: 4.8,
    reviews: 126,
    delivery: "Tomorrow",
    freeDelivery: true,
    stock: "in",
    tags: ["bestseller", "deal"],
    specs: [
      { label: "Voltage", value: "18 V" },
      { label: "Motor", value: "Brushless" },
      { label: "Max torque", value: "55 Nm" },
      { label: "No-load speed", value: "0–1,900 rpm" },
      { label: "Chuck", value: "13 mm keyless" },
      { label: "Battery", value: "2 × 2.0 Ah Li-ion" },
    ],
    compatibility: ["Bosch Professional 18V ProCORE batteries", "GAL 18V-20 charger", "13 mm SDS-free accessories"],
    included: ["Drill body", "2 × 2.0 Ah batteries", "GAL 18V-20 charger", "Depth stop", "Carry case"],
    warranty: "1 year manufacturer warranty, extendable to 3 years on registration",
    glance: ["Brushless motor for longer runtime", "55 Nm torque for masonry and steel", "Two-speed gearbox"],
  }),
  p({
    id: "polycab-2-5-fr-wire",
    brand: "Polycab",
    name: "2.5 sq mm FR Copper Wire, 90 m",
    category: "wires-cables",
    specLine: "2.5 sq mm · Single core · 90 m · FR PVC",
    price: 2299,
    mrp: 3150,
    rating: 4.7,
    reviews: 842,
    delivery: "Tomorrow",
    freeDelivery: true,
    stock: "in",
    unit: "per coil",
    tags: ["bestseller"],
    specs: [
      { label: "Cable size", value: "2.5 sq mm" },
      { label: "Cores", value: "1" },
      { label: "Conductor", value: "Electrolytic grade copper" },
      { label: "Insulation", value: "FR PVC" },
      { label: "Length", value: "90 m" },
      { label: "Voltage grade", value: "1100 V" },
    ],
    compatibility: ["16 A power circuits", "20 mm conduit", "Standard 2.5 sq mm lugs"],
    included: ["1 × 90 m coil"],
    warranty: "Brand quality assurance as per IS 694",
    glance: ["Flame retardant PVC insulation", "Suited to 16 A socket circuits", "ISI marked"],
  }),
  p({
    id: "havells-32a-mcb",
    brand: "Havells",
    name: "32 A Single Pole MCB, C Curve",
    category: "electrical",
    specLine: "32 A · SP · C curve · 10 kA",
    price: 289,
    mrp: 415,
    rating: 4.6,
    reviews: 1204,
    delivery: "Today",
    freeDelivery: false,
    stock: "in",
    tags: ["bestseller", "recommended"],
    specs: [
      { label: "Current rating", value: "32 A" },
      { label: "Poles", value: "Single pole" },
      { label: "Curve", value: "C" },
      { label: "Breaking capacity", value: "10 kA" },
      { label: "Phase", value: "Single phase" },
      { label: "Mounting", value: "35 mm DIN rail" },
    ],
    compatibility: ["Havells distribution boards", "35 mm DIN rail", "Up to 6 sq mm conductors"],
    included: ["1 × MCB"],
    warranty: "2 year replacement warranty",
    glance: ["C curve for mixed lighting and power loads", "10 kA short-circuit capacity", "DIN rail mount"],
    callouts: ["32 A", "C-curve", "10 kA"],
    glanceStats: [
      { value: "32 A", label: "Rated current" },
      { value: "10 kA", label: "Breaking capacity" },
      { value: "240 V", label: "Rated voltage" },
      { value: "1", label: "Module width" },
    ],
    variant: { group: "havells-32a-c", axis: "Poles", label: "SP" },
  }),
  mcb({ id: "havells-32a-dp-mcb", brand: "Havells", poles: "DP", curve: "C", price: 640, mrp: 905, rating: 4.6, reviews: 388, delivery: "Today", freeDelivery: false, group: "havells-32a-c" }),
  mcb({ id: "havells-32a-tp-mcb", brand: "Havells", poles: "TP", curve: "C", price: 1020, mrp: 1450, rating: 4.7, reviews: 214, delivery: "Tomorrow", freeDelivery: true, group: "havells-32a-c" }),
  mcb({ id: "havells-32a-tpn-mcb", brand: "Havells", poles: "TPN", curve: "C", price: 1480, mrp: 2090, rating: 4.6, reviews: 97, delivery: "In 3 days", freeDelivery: true, group: "havells-32a-c", stock: "out" }),
  mcb({ id: "schneider-32a-sp-mcb", brand: "Schneider Electric", poles: "SP", curve: "C", price: 315, mrp: 440, rating: 4.7, reviews: 931, delivery: "Tomorrow", freeDelivery: false }),
  mcb({ id: "legrand-32a-sp-b-mcb", brand: "Legrand", poles: "SP", curve: "B", price: 298, mrp: 420, rating: 4.5, reviews: 402, delivery: "Tomorrow", freeDelivery: false }),
  mcb({ id: "lt-32a-dp-mcb", brand: "L&T", poles: "DP", curve: "C", price: 695, mrp: 980, rating: 4.6, reviews: 276, delivery: "In 2 days", freeDelivery: true }),
  p({
    id: "philips-20w-batten",
    brand: "Philips",
    name: "20W LED Batten, 4 ft Cool Daylight",
    category: "lighting",
    specLine: "20 W · 2,000 lm · 6500 K · IP20",
    price: 649,
    mrp: 999,
    rating: 4.5,
    reviews: 2310,
    delivery: "Tomorrow",
    freeDelivery: true,
    stock: "in",
    tags: ["deal", "recommended"],
    specs: [
      { label: "Wattage", value: "20 W" },
      { label: "Luminous flux", value: "2,000 lm" },
      { label: "Colour temperature", value: "6500 K" },
      { label: "IP rating", value: "IP20" },
      { label: "Length", value: "1,200 mm" },
      { label: "Input", value: "140–270 V AC" },
    ],
    compatibility: ["Surface and ceiling mount", "Standard 4 ft batten brackets"],
    included: ["Batten", "Mounting clips", "Screws"],
    warranty: "2 year warranty",
    glance: ["Wide voltage operation", "Flicker-free driver", "100 lm/W efficacy"],
  }),
  p({
    id: "supreme-25mm-pvc-pipe",
    brand: "Supreme",
    name: "25 mm UPVC Plumbing Pipe, 3 m",
    category: "plumbing",
    specLine: "25 mm · UPVC · Schedule 40 · 3 m",
    price: 218,
    mrp: 285,
    rating: 4.4,
    reviews: 486,
    delivery: "In 2 days",
    freeDelivery: false,
    stock: "in",
    unit: "per length",
    tags: ["new"],
    specs: [
      { label: "Diameter", value: "25 mm" },
      { label: "Material", value: "UPVC" },
      { label: "Length", value: "3 m" },
      { label: "Connection", value: "Solvent weld" },
      { label: "Schedule", value: "40" },
      { label: "Standard", value: "IS 4985" },
    ],
    compatibility: ["25 mm solvent weld fittings", "PVC solvent cement", "Cold water lines"],
    included: ["1 × 3 m pipe"],
    warranty: "Manufacturer defect replacement",
    glance: ["Lead-free UPVC", "Cold water rated", "Solvent weld jointing"],
  }),
  p({
    id: "stanley-65pc-kit",
    brand: "Stanley",
    name: "65-Piece Hand Tool Kit",
    category: "hand-tools",
    specLine: "65 pieces · CRV steel · Blow case",
    price: 2149,
    mrp: 3499,
    rating: 4.6,
    reviews: 973,
    delivery: "Tomorrow",
    freeDelivery: true,
    stock: "low",
    tags: ["bestseller", "deal"],
    specs: [
      { label: "Pieces", value: "65" },
      { label: "Material", value: "Chrome vanadium steel" },
      { label: "Drive", value: "1/4 in" },
      { label: "Case", value: "Moulded blow case" },
      { label: "Finish", value: "Nickel plated" },
    ],
    compatibility: ["1/4 in bits and sockets", "General maintenance work"],
    included: ["Ratchet", "Sockets", "Bits", "Pliers", "Measuring tape", "Case"],
    warranty: "Limited lifetime warranty on hand tools",
    glance: ["Covers most home and site tasks", "Hardened CRV steel", "Organised case layout"],
  }),
  p({
    id: "3m-h700-helmet",
    brand: "3M",
    name: "Safety Helmet H-700, Ratchet",
    category: "safety",
    specLine: "Class E · Ratchet · 4-point harness",
    price: 549,
    mrp: 749,
    rating: 4.7,
    reviews: 318,
    delivery: "Tomorrow",
    freeDelivery: true,
    stock: "in",
    tags: ["recommended"],
    specs: [
      { label: "Class", value: "E (electrical)" },
      { label: "Harness", value: "4-point textile" },
      { label: "Adjustment", value: "Ratchet, 53–64 cm" },
      { label: "Shell", value: "HDPE" },
      { label: "Weight", value: "365 g" },
    ],
    compatibility: ["3M slotted visors", "Ear muff attachments"],
    included: ["Helmet with harness"],
    warranty: "Replace 5 years from manufacture date",
    glance: ["Electrical class E protection", "Ratchet size adjustment", "Accessory slots"],
  }),
  p({
    id: "ultratech-opc-53",
    brand: "UltraTech",
    name: "OPC 53 Grade Cement, 50 kg",
    category: "construction-supplies",
    specLine: "OPC · 53 grade · 50 kg bag",
    price: 425,
    mrp: 470,
    rating: 4.3,
    reviews: 1560,
    delivery: "In 3 days",
    freeDelivery: false,
    stock: "in",
    unit: "per bag",
    tags: [],
    specs: [
      { label: "Type", value: "Ordinary Portland Cement" },
      { label: "Grade", value: "53" },
      { label: "Weight", value: "50 kg" },
      { label: "Standard", value: "IS 269" },
    ],
    compatibility: ["Structural RCC work", "Plaster and masonry with sand mix"],
    included: ["1 × 50 kg bag"],
    warranty: "Not applicable",
    glance: ["High early strength", "Suited to RCC and precast", "Palletised delivery"],
  }),
  p({
    id: "hilti-anchor-set",
    brand: "Hilti",
    name: "M10 Wedge Anchor Set, 50 pcs",
    category: "fasteners",
    specLine: "M10 × 90 mm · Zinc plated · 50 pcs",
    price: 1890,
    mrp: 2350,
    rating: 4.8,
    reviews: 142,
    delivery: "In 2 days",
    freeDelivery: true,
    stock: "in",
    unit: "per box",
    tags: ["new"],
    specs: [
      { label: "Size", value: "M10 × 90 mm" },
      { label: "Material", value: "Carbon steel" },
      { label: "Finish", value: "Zinc plated" },
      { label: "Pack size", value: "50 pieces" },
      { label: "Drill size", value: "10 mm" },
    ],
    compatibility: ["Concrete C20/25 and above", "10 mm hammer drill bits"],
    included: ["50 anchors with nuts and washers"],
    warranty: "Manufacturer defect replacement",
    glance: ["For cracked and uncracked concrete", "Through-fastening design", "Consistent setting depth"],
  }),
  p({
    id: "makita-ga5030-grinder",
    brand: "Makita",
    name: "125 mm Angle Grinder GA5030",
    category: "power-tools",
    specLine: "720 W · 125 mm · 11,000 rpm",
    price: 3690,
    mrp: 4790,
    rating: 4.6,
    reviews: 604,
    delivery: "Tomorrow",
    freeDelivery: true,
    stock: "in",
    tags: ["bestseller"],
    specs: [
      { label: "Power", value: "720 W" },
      { label: "Disc size", value: "125 mm" },
      { label: "No-load speed", value: "11,000 rpm" },
      { label: "Spindle", value: "M14" },
      { label: "Weight", value: "1.8 kg" },
    ],
    compatibility: ["125 mm cutting and grinding discs", "M14 spindle accessories"],
    included: ["Grinder", "Side handle", "Wheel guard", "Spanner"],
    warranty: "1 year warranty",
    glance: ["Compact barrel grip", "Labyrinth dust protection", "Lock-on switch"],
  }),
  p({
    id: "honeywell-nitrile-gloves",
    brand: "Honeywell",
    name: "Nitrile Coated Safety Gloves, Pack of 12",
    category: "safety",
    specLine: "Level 3 cut · Nitrile palm · Size 9",
    price: 749,
    mrp: 1100,
    rating: 4.4,
    reviews: 221,
    delivery: "Tomorrow",
    freeDelivery: false,
    stock: "in",
    unit: "per pack",
    tags: ["deal"],
    specs: [
      { label: "Cut resistance", value: "Level 3" },
      { label: "Coating", value: "Nitrile palm" },
      { label: "Size", value: "9 (L)" },
      { label: "Pack size", value: "12 pairs" },
    ],
    compatibility: ["General handling", "Assembly and maintenance"],
    included: ["12 pairs"],
    warranty: "Not applicable",
    glance: ["Good grip on oily parts", "Breathable knit back", "Bulk pack for teams"],
  }),
  p({
    id: "crompton-1hp-monoblock",
    brand: "Crompton",
    name: "1 HP Monoblock Water Pump",
    category: "pumps-motors",
    specLine: "1 HP · 25 mm outlet · 28 m head",
    price: 4290,
    mrp: 5650,
    rating: 4.2,
    reviews: 389,
    delivery: "In 3 days",
    freeDelivery: true,
    stock: "low",
    tags: ["recommended"],
    specs: [
      { label: "Power", value: "1 HP / 0.75 kW" },
      { label: "Outlet", value: "25 mm" },
      { label: "Max head", value: "28 m" },
      { label: "Phase", value: "Single phase" },
      { label: "Speed", value: "2,880 rpm" },
    ],
    compatibility: ["25 mm suction and delivery lines", "Single phase 230 V supply"],
    included: ["Pump set", "Capacitor box"],
    warranty: "1 year warranty",
    glance: ["Continuous duty rating", "Cast iron body", "Thermal overload protection"],
  }),
  p({
    id: "asian-paints-primer",
    brand: "Asian Paints",
    name: "Cement Primer Water Based, 10 L",
    category: "paint-adhesives",
    specLine: "10 L · Water based · Interior & exterior",
    price: 1690,
    mrp: 2100,
    rating: 4.5,
    reviews: 512,
    delivery: "In 2 days",
    freeDelivery: true,
    stock: "in",
    unit: "per bucket",
    tags: ["new"],
    specs: [
      { label: "Volume", value: "10 L" },
      { label: "Base", value: "Water based" },
      { label: "Coverage", value: "100–120 sq ft/L" },
      { label: "Drying", value: "Recoat in 4 hours" },
    ],
    compatibility: ["Plaster and concrete surfaces", "Emulsion topcoats"],
    included: ["1 × 10 L bucket"],
    warranty: "Not applicable",
    glance: ["Low odour", "Good alkali resistance", "Improves topcoat uniformity"],
  }),
  p({
    id: "skf-6205-bearing",
    brand: "SKF",
    name: "6205-2RS Deep Groove Ball Bearing",
    category: "industrial-supplies",
    specLine: "25 × 52 × 15 mm · Sealed · Chrome steel",
    price: 389,
    mrp: 520,
    rating: 4.7,
    reviews: 706,
    delivery: "Tomorrow",
    freeDelivery: false,
    stock: "in",
    tags: ["bestseller"],
    specs: [
      { label: "Bore", value: "25 mm" },
      { label: "Outer diameter", value: "52 mm" },
      { label: "Width", value: "15 mm" },
      { label: "Seal", value: "2RS rubber" },
      { label: "Material", value: "Chrome steel" },
    ],
    compatibility: ["25 mm shafts", "Electric motors and pumps"],
    included: ["1 × bearing"],
    warranty: "Genuine product guarantee",
    glance: ["Pre-greased sealed design", "Low noise operation", "Common motor replacement size"],
  }),
  p({
    id: "godrej-ultra-lock",
    brand: "Godrej",
    name: "Ultra Tribolt Mortise Door Lock",
    category: "hardware",
    specLine: "Brass · 3-bolt · 5 keys",
    price: 2790,
    mrp: 3890,
    rating: 4.5,
    reviews: 264,
    delivery: "Tomorrow",
    freeDelivery: true,
    stock: "in",
    tags: ["recommended"],
    specs: [
      { label: "Material", value: "Brass" },
      { label: "Bolts", value: "3" },
      { label: "Keys", value: "5" },
      { label: "Finish", value: "Satin nickel" },
      { label: "Door thickness", value: "35–45 mm" },
    ],
    compatibility: ["Wooden main doors 35–45 mm", "Standard mortise cutouts"],
    included: ["Lock body", "Handles", "5 keys", "Screws"],
    warranty: "3 year warranty against manufacturing defects",
    glance: ["Hardened anti-saw bolts", "Six-pin cylinder", "Main door grade"],
  }),
  p({
    id: "wd40-multi-use",
    brand: "WD-40",
    name: "Multi-Use Lubricant Spray, 420 ml",
    category: "cleaning-maintenance",
    specLine: "420 ml · Smart straw · Multi-purpose",
    price: 425,
    mrp: 545,
    rating: 4.8,
    reviews: 1890,
    delivery: "Today",
    freeDelivery: false,
    stock: "in",
    tags: ["bestseller", "deal"],
    specs: [
      { label: "Volume", value: "420 ml" },
      { label: "Applicator", value: "Smart straw" },
      { label: "Use", value: "Lubricate, clean, protect" },
    ],
    compatibility: ["Metal fittings, hinges, chains", "Not for use on painted plastics"],
    included: ["1 × can"],
    warranty: "Not applicable",
    glance: ["Displaces moisture", "Loosens seized parts", "Two spray modes"],
  }),
  p({
    id: "finolex-4sqmm-flex",
    brand: "Finolex",
    name: "4 sq mm 3-Core Flexible Cable, 100 m",
    category: "wires-cables",
    specLine: "4 sq mm · 3 core · Flexible · 100 m",
    price: 9450,
    mrp: 11800,
    rating: 4.6,
    reviews: 173,
    delivery: "In 2 days",
    freeDelivery: true,
    stock: "in",
    unit: "per coil",
    tags: ["new"],
    specs: [
      { label: "Cable size", value: "4 sq mm" },
      { label: "Cores", value: "3" },
      { label: "Conductor", value: "Annealed copper" },
      { label: "Insulation", value: "PVC, flexible" },
      { label: "Length", value: "100 m" },
    ],
    compatibility: ["Submersible and motor connections", "32 A circuits"],
    included: ["1 × 100 m coil"],
    warranty: "As per IS 694",
    glance: ["High flexibility for machines", "Copper conductor", "Tough outer sheath"],
  }),
  p({
    id: "wipro-100w-floodlight",
    brand: "Wipro",
    name: "100W LED Floodlight, IP66",
    category: "lighting",
    specLine: "100 W · 9,000 lm · 5700 K · IP66",
    price: 2390,
    mrp: 3400,
    rating: 4.4,
    reviews: 287,
    delivery: "Tomorrow",
    freeDelivery: true,
    stock: "out",
    tags: [],
    specs: [
      { label: "Wattage", value: "100 W" },
      { label: "Luminous flux", value: "9,000 lm" },
      { label: "Colour temperature", value: "5700 K" },
      { label: "IP rating", value: "IP66" },
      { label: "Beam angle", value: "120°" },
    ],
    compatibility: ["Outdoor yokes and poles", "230 V AC supply"],
    included: ["Floodlight", "Mounting bracket"],
    warranty: "2 year warranty",
    glance: ["Weatherproof IP66 housing", "Die-cast aluminium body", "Surge protected driver"],
  }),
  p({
    id: "legrand-modular-switch",
    brand: "Legrand",
    name: "16 A Modular Switch, 1 Module",
    category: "electrical",
    specLine: "16 A · 1 module · White",
    price: 165,
    mrp: 225,
    rating: 4.5,
    reviews: 921,
    delivery: "Tomorrow",
    freeDelivery: false,
    stock: "in",
    tags: ["recommended"],
    specs: [
      { label: "Current rating", value: "16 A" },
      { label: "Modules", value: "1" },
      { label: "Colour", value: "White" },
      { label: "Type", value: "One-way switch" },
    ],
    compatibility: ["Legrand Myrius plates", "Standard modular boxes"],
    included: ["1 × switch module"],
    warranty: "2 year warranty",
    glance: ["Silver alloy contacts", "Smooth actuation", "Fits standard plates"],
  }),
  p({
    id: "taparia-spanner-set",
    brand: "Taparia",
    name: "Double Ended Spanner Set, 8 pcs",
    category: "hand-tools",
    specLine: "6–22 mm · 8 pieces · Chrome plated",
    price: 899,
    mrp: 1250,
    rating: 4.5,
    reviews: 655,
    delivery: "Tomorrow",
    freeDelivery: false,
    stock: "in",
    tags: ["deal"],
    specs: [
      { label: "Range", value: "6–22 mm" },
      { label: "Pieces", value: "8" },
      { label: "Material", value: "Forged steel" },
      { label: "Finish", value: "Chrome plated" },
    ],
    compatibility: ["Metric fasteners 6–22 mm"],
    included: ["8 spanners", "Pouch"],
    warranty: "Manufacturer defect replacement",
    glance: ["Accurate jaw tolerance", "Corrosion resistant finish", "Everyday workshop set"],
  }),
  p({
    id: "astral-pvc-fitting-set",
    brand: "Astral",
    name: "25 mm UPVC Fittings Set, 10 pcs",
    category: "plumbing",
    specLine: "25 mm · Elbows, tees, couplers",
    price: 540,
    mrp: 720,
    rating: 4.3,
    reviews: 198,
    delivery: "In 2 days",
    freeDelivery: false,
    stock: "in",
    unit: "per set",
    tags: [],
    specs: [
      { label: "Diameter", value: "25 mm" },
      { label: "Material", value: "UPVC" },
      { label: "Connection", value: "Solvent weld" },
      { label: "Pack size", value: "10 pieces" },
    ],
    compatibility: ["25 mm UPVC pipe", "Solvent cement jointing"],
    included: ["4 elbows", "3 tees", "3 couplers"],
    warranty: "Manufacturer defect replacement",
    glance: ["Consistent socket depth", "Lead-free compound", "Cold water rated"],
  }),
  p({
    id: "jk-lakshmi-wire-mesh",
    brand: "JK",
    name: "Welded Wire Mesh 2 × 2 in, 12 m Roll",
    category: "construction-supplies",
    specLine: "2 × 2 in · 12 m roll · GI",
    price: 1980,
    mrp: 2450,
    rating: 4.1,
    reviews: 87,
    delivery: "In 3 days",
    freeDelivery: false,
    stock: "in",
    unit: "per roll",
    tags: [],
    specs: [
      { label: "Mesh size", value: "2 × 2 in" },
      { label: "Length", value: "12 m" },
      { label: "Material", value: "Galvanised iron" },
      { label: "Wire gauge", value: "12 SWG" },
    ],
    compatibility: ["Plaster reinforcement", "Fencing and guarding"],
    included: ["1 × roll"],
    warranty: "Not applicable",
    glance: ["Galvanised for outdoor use", "Uniform weld points", "Easy to cut on site"],
  }),
  p({
    id: "bosch-gbh-2-26",
    brand: "Bosch Professional",
    name: "SDS-Plus Rotary Hammer GBH 2-26",
    category: "power-tools",
    specLine: "830 W · SDS-Plus · 2.7 J",
    price: 11490,
    mrp: 14900,
    rating: 4.9,
    reviews: 341,
    delivery: "Tomorrow",
    freeDelivery: true,
    stock: "in",
    tags: ["bestseller"],
    specs: [
      { label: "Power", value: "830 W" },
      { label: "Impact energy", value: "2.7 J" },
      { label: "Chuck", value: "SDS-Plus" },
      { label: "Drilling range", value: "4–26 mm in concrete" },
      { label: "Modes", value: "Drill, hammer drill, chisel" },
    ],
    compatibility: ["SDS-Plus bits and chisels", "Bosch dust extraction adapters"],
    included: ["Hammer", "Side handle", "Depth stop", "Case"],
    warranty: "1 year warranty",
    glance: ["Three operating modes", "Rotation stop for chiselling", "Vibration control handle"],
  }),
  p({
    id: "generic-ss-bolt-set",
    brand: "Unbrako",
    name: "M8 Stainless Hex Bolt Set, 100 pcs",
    category: "fasteners",
    specLine: "M8 × 40 mm · SS304 · 100 pcs",
    price: 1120,
    mrp: 1480,
    rating: 4.4,
    reviews: 129,
    delivery: "Tomorrow",
    freeDelivery: false,
    stock: "in",
    unit: "per box",
    tags: ["recommended"],
    specs: [
      { label: "Size", value: "M8 × 40 mm" },
      { label: "Material", value: "Stainless steel 304" },
      { label: "Pack size", value: "100 pieces" },
      { label: "Head", value: "Hex" },
    ],
    compatibility: ["M8 nuts and washers", "Outdoor and wet areas"],
    included: ["100 bolts"],
    warranty: "Not applicable",
    glance: ["Corrosion resistant SS304", "Consistent thread quality", "Bulk pack"],
  }),
  ...catalogueDepth,
];

export const productById = (id: string) => products.find((x) => x.id === id);

export const brands = [
  "Bosch Professional",
  "Polycab",
  "Havells",
  "Philips",
  "Supreme",
  "Stanley",
  "3M",
  "Makita",
  "Legrand",
  "Astral",
  "SKF",
  "Godrej",
  "Schneider Electric",
  "L&T",
  "DeWalt",
  "Hitachi",
  "Syska",
  "Wipro",
  "Finolex",
  "Ashirvad",
];

export const discount = (product: Product) => Math.round(((product.mrp - product.price) / product.mrp) * 100);

export const inr = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

export const filterGroupsByCategory: Record<string, Array<{ label: string; options: string[] }>> = {
  "power-tools": [
    { label: "Brand", options: ["Bosch Professional", "Makita", "DeWalt", "Stanley", "Black+Decker", "Hitachi"] },
    { label: "Product type", options: ["Drill", "Impact drill", "Angle grinder", "Rotary hammer"] },
    { label: "Voltage", options: ["12 V", "18 V", "36 V"] },
    { label: "Motor", options: ["Brushless", "Brushed"] },
    { label: "Battery type", options: ["Li-ion 2.0 Ah", "Li-ion 4.0 Ah", "Bare tool"] },
    { label: "Torque", options: ["Up to 40 Nm", "40–60 Nm", "Above 60 Nm"] },
  ],
  electrical: [
    { label: "Brand", options: ["Havells", "Legrand", "Schneider Electric", "L&T", "Anchor"] },
    { label: "Product type", options: ["MCB", "RCCB", "Switch", "Distribution board"] },
    { label: "Current", options: ["6 A", "16 A", "32 A", "63 A"] },
    { label: "Curve", options: ["B", "C", "D"] },
    { label: "Voltage", options: ["240 V", "415 V"] },
    { label: "Poles", options: ["SP", "DP", "TP", "TPN"] },
    { label: "Rating", options: ["6 kA", "10 kA"] },
    { label: "Phase", options: ["Single phase", "Three phase"] },
  ],
  lighting: [
    { label: "Brand", options: ["Philips", "Wipro", "Syska", "Havells"] },
    { label: "Product type", options: ["Batten", "Floodlight", "Panel", "Bulb"] },
    { label: "Wattage", options: ["9 W", "20 W", "50 W", "100 W"] },
    { label: "Lumens", options: ["Up to 1,000", "1,000–3,000", "Above 3,000"] },
    { label: "Colour temperature", options: ["3000 K", "4000 K", "6500 K"] },
    { label: "IP rating", options: ["IP20", "IP65", "IP66"] },
  ],
  "wires-cables": [
    { label: "Brand", options: ["Polycab", "Finolex", "KEI", "Havells"] },
    { label: "Cable type", options: ["FR", "Flexible", "Armoured", "Submersible"] },
    { label: "Size", options: ["1.0 sq mm", "1.5 sq mm", "2.5 sq mm", "4 sq mm"] },
    { label: "Core", options: ["1 core", "2 core", "3 core", "4 core"] },
    { label: "Length", options: ["90 m", "100 m", "180 m"] },
    { label: "Conductor", options: ["Copper", "Aluminium"] },
    { label: "Insulation", options: ["PVC", "FR PVC", "XLPE"] },
  ],
  plumbing: [
    { label: "Brand", options: ["Supreme", "Astral", "Finolex", "Ashirvad"] },
    { label: "Product type", options: ["Pipe", "Fitting", "Valve", "Tank connector"] },
    { label: "Diameter", options: ["20 mm", "25 mm", "40 mm", "63 mm"] },
    { label: "Material", options: ["UPVC", "CPVC", "PVC", "Brass"] },
    { label: "Length", options: ["1 m", "3 m", "6 m"] },
    { label: "Connection type", options: ["Solvent weld", "Threaded", "Push fit"] },
  ],
  hardware: [
    { label: "Brand", options: ["Godrej", "Ebco", "Hettich", "Dorset"] },
    { label: "Product type", options: ["Lock", "Hinge", "Channel", "Handle"] },
    { label: "Material", options: ["Brass", "Stainless steel", "Zinc alloy"] },
    { label: "Size", options: ["Small", "Medium", "Large"] },
    { label: "Finish", options: ["Satin nickel", "Antique brass", "Chrome"] },
    { label: "Pack size", options: ["1", "2", "10"] },
  ],
};

export const defaultFilterGroups = [
  { label: "Brand", options: brands.slice(0, 6) },
  { label: "Availability", options: ["In stock", "Delivery tomorrow", "Free delivery"] },
  { label: "Rating", options: ["4.5 and above", "4.0 and above", "3.5 and above"] },
];

export const priceBands = ["Under ₹500", "₹500 – ₹2,000", "₹2,000 – ₹10,000", "Above ₹10,000"];

/** The local catalogue is the source of truth for facets and their counts. */
export function filterGroupsFor(categorySlug: string | undefined, catalogue: Product[]) {
  const configured = filterGroupsByCategory[categorySlug ?? ""] ?? defaultFilterGroups;
  return [...configured, { label: "Price", options: priceBands }].map((group) => {
    const actual = group.label === "Brand"
      ? [...new Set(catalogue.map((p) => p.brand))]
      : group.label === "Curve"
        ? [...new Set(catalogue.flatMap((p) => p.specs.filter((s) => s.label === "Curve").map((s) => s.value)))]
        : group.label === "Product type" && categorySlug === "electrical"
          ? [...new Set(catalogue.map((p) => /\bMCB\b/i.test(p.name) ? "MCB" : /\bswitch\b/i.test(p.name) ? "Switch" : "").filter(Boolean))]
          : [];
    return { label: group.label, options: group.label === "Brand" ? actual : [...new Set([...actual, ...group.options])] };
  });
}

const normalized = (value: string) => value.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9.]/g, "");

export function productMatchesFacet(product: Product, group: string, option: string): boolean {
  const specs = product.specs;
  const specMatches = (labels: string[]) => specs.some((s) => labels.includes(s.label) && normalized(s.value) === normalized(option));
  const text = `${product.name} ${product.specLine}`.toLowerCase();
  if (group === "Brand") return product.brand === option;
  if (group === "Price") {
    if (option === priceBands[0]) return product.price < 500;
    if (option === priceBands[1]) return product.price >= 500 && product.price <= 2000;
    if (option === priceBands[2]) return product.price > 2000 && product.price <= 10000;
    return product.price > 10000;
  }
  if (group === "Rating" && option.includes("above")) return product.rating >= Number.parseFloat(option);
  if (group === "Availability") {
    if (option === "In stock") return product.stock !== "out";
    if (option === "Delivery tomorrow") return product.delivery === "Tomorrow";
    return product.freeDelivery;
  }
  const num = (label: string) => Number.parseFloat((specs.find((x) => x.label === label)?.value ?? "").replace(/,/g, ""));
  if (group === "Torque") {
    const t = num("Max torque");
    if (Number.isNaN(t)) return false;
    return option.startsWith("Up to") ? t <= 40 : option.startsWith("Above") ? t > 60 : t > 40 && t <= 60;
  }
  if (group === "Lumens") {
    const l = num("Luminous flux");
    if (Number.isNaN(l)) return false;
    return option.startsWith("Up to") ? l <= 1000 : option.startsWith("Above") ? l > 3000 : l > 1000 && l <= 3000;
  }
  if (group === "Connection type") return specMatches(["Connection type", "Connection"]);
  if (group === "Product type" && option === "Drill") return /\bdrill\b/i.test(product.name);
  if (group === "Product type" && option === "Impact drill") return /impact drill/i.test(product.name);
  if (group === "Product type" || group === "Cable type") {
    return new RegExp(`\\b${option.toLowerCase()}\\b`).test(text) ||
      (option === "Drill" && /drill/.test(text)) || (option === "Wire" && /wire|cable/.test(text));
  }
  if (group === "Poles") {
    return specMatches(["Poles"]) || new RegExp(`\\b${option.toLowerCase()}\\b`).test(product.specLine.toLowerCase());
  }
  if (group === "Current") return specMatches(["Current rating"]);
  if (group === "Size") return specMatches(["Cable size", "Size"]);
  if (group === "Rating") return specMatches(["Breaking capacity"]);
  if (group === "Curve") return specMatches(["Curve"]);
  if (group === "Voltage") return specMatches(["Voltage", "Rated voltage"]) ||
    product.glanceStats?.some((s) => s.label === "Rated voltage" && normalized(s.value) === normalized(option)) === true;
  if (specMatches([group, group === "Core" ? "Cores" : group])) return true;
  return text.includes(option.toLowerCase());
}

export function filterProducts(catalogue: Product[], filters: Record<string, string[]>) {
  return catalogue.filter((product) => Object.entries(filters).every(([group, options]) =>
    options.length === 0 || options.some((option) => productMatchesFacet(product, group, option))
  ));
}
