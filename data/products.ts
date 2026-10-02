import type { Product } from "@/types/product";

const img = (id: string) =>
  `https://images.unsplash.com/${id}?w=800&q=80&auto=format&fit=crop`;

type Seed = [
  string,
  string,
  number,
  number | undefined,
  string,
  string,
  Product["badge"],
  number,
  string[],
  string[] | undefined,
];

const seeds: Seed[] = [
  ["kanpur-weekender", "Kanpur Weekender", 18900, 21900, "bags", "atelier-leather", "Bestseller", 12, ["Cognac", "Espresso"], undefined],
  ["jodhpur-sling", "Jodhpur Sling", 8900, undefined, "bags", "monsoon-edit", "New", 28, ["Olive", "Ink"], undefined],
  ["udaipur-tote", "Udaipur Structured Tote", 12400, 14900, "bags", "evening-line", "Sale", 6, ["Sand", "Black"], undefined],
  ["calico-crossbody", "Calico Crossbody", 7200, undefined, "bags", "monsoon-edit", undefined, 0, ["Stone"], undefined],
  ["varanasi-belt-bag", "Varanasi Belt Bag", 6800, undefined, "bags", "atelier-leather", "New", 19, ["Cognac"], undefined],
  ["monsoon-field-jacket", "Monsoon Field Jacket", 15800, undefined, "outerwear", "monsoon-edit", "Bestseller", 9, ["Charcoal", "Slate"], ["S", "M", "L", "XL"]],
  ["deccan-linen-blazer", "Deccan Linen Blazer", 14200, 16800, "outerwear", "evening-line", "Sale", 14, ["Ivory", "Midnight"], ["S", "M", "L", "XL"]],
  ["shola-overcoat", "Shola Overcoat", 22400, undefined, "outerwear", "atelier-leather", undefined, 3, ["Camel"], ["S", "M", "L"]],
  ["coastal-windbreaker", "Coastal Windbreaker", 9800, undefined, "outerwear", "monsoon-edit", "New", 22, ["Navy", "Olive"], ["S", "M", "L", "XL"]],
  ["jaipur-wallet", "Jaipur Bifold Wallet", 4200, undefined, "accessories", "atelier-leather", "Bestseller", 45, ["Cognac", "Black"], undefined],
  ["brass-key-tray", "Brass Key Tray", 3600, undefined, "home", "evening-line", undefined, 31, ["Brass"], undefined],
  ["kashi-card-case", "Kashi Card Case", 2800, 3200, "accessories", "atelier-leather", "Sale", 18, ["Espresso"], undefined],
  ["surat-belt", "Surat Harness Belt", 5400, undefined, "accessories", "atelier-leather", undefined, 11, ["Black", "Cognac"], ["30", "32", "34", "36"]],
  ["madras-passport-cover", "Madras Passport Cover", 3200, undefined, "accessories", "monsoon-edit", "New", 26, ["Olive", "Ink"], undefined],
  ["stone-desk-pad", "Stone Desk Pad", 7800, undefined, "home", "evening-line", undefined, 8, ["Graphite"], undefined],
  ["goa-loafer", "Goa Hand-Stitched Loafer", 11200, 12800, "footwear", "evening-line", "Sale", 7, ["Tan", "Black"], ["7", "8", "9", "10", "11"]],
  ["monsoon-derby", "Monsoon Derby", 13400, undefined, "footwear", "monsoon-edit", "Bestseller", 5, ["Brown"], ["7", "8", "9", "10"]],
  ["atelier-sandal", "Atelier Slide Sandal", 8600, undefined, "footwear", "atelier-leather", undefined, 2, ["Cognac"], ["7", "8", "9", "10"]],
  ["evening-clutch", "Evening Line Clutch", 9600, undefined, "bags", "evening-line", "New", 15, ["Black", "Champagne"], undefined],
  ["heritage-duffel", "Heritage Duffel", 19800, undefined, "bags", "atelier-leather", undefined, 4, ["Espresso"], undefined],
  ["linen-scarf", "Kashmir Linen Scarf", 4800, undefined, "accessories", "monsoon-edit", undefined, 33, ["Oat", "Indigo"], undefined],
  ["travel-organizer", "Travel Organizer", 6400, 7200, "accessories", "monsoon-edit", "Sale", 10, ["Stone"], undefined],
  ["wool-shawl-coat", "Wool Shawl Coat", 17600, undefined, "outerwear", "evening-line", "New", 6, ["Charcoal"], ["S", "M", "L"]],
  ["brass-candle-set", "Brass Candle Set", 5200, undefined, "home", "evening-line", undefined, 20, ["Brass"], undefined],
];

const descriptions: Record<string, string> = {
  "kanpur-weekender":
    "A soft-structure weekender with reinforced base and cotton twill lining. Fits cabin overhead with room for shoes in the side pocket.",
  "jodhpur-sling":
    "Compact sling with magnetic closure and water-repellent exterior. Wears flush for metro commutes and evening walks.",
  "udaipur-tote":
    "Architectural tote with interior laptop sleeve and brushed brass feet. Designed to stand upright on marble or studio floors.",
  "calico-crossbody":
    "Minimal crossbody in pebbled leather with adjustable strap. Sold out online—join the waitlist for the next atelier drop.",
  "varanasi-belt-bag":
    "Slim belt bag with hidden back pocket for transit cards. Sits comfortably high on the waist without bulk.",
  "monsoon-field-jacket":
    "Lightweight shell with taped seams and vented back panel. Layers over knit polos or fine merino without overheating.",
  "deccan-linen-blazer":
    "Unstructured linen blazer with horn buttons and partial lining. Breathable enough for Mumbai afternoons, sharp for dinner.",
  "shola-overcoat":
    "Longline coat in brushed wool blend with deep pockets. Limited run—only three pieces remain in camel.",
  "coastal-windbreaker":
    "Packable windbreaker with matte finish and storm flap. Folds into its own interior pocket for travel.",
  "jaipur-wallet":
    "Six-card wallet with RFID lining and hand-painted edge. Develops character within weeks of daily carry.",
  "brass-key-tray":
    "Cast brass tray with felt base to protect entry tables. Pairs with our stone desk objects.",
  "kashi-card-case":
    "Slim card case holding eight cards and folded notes. Sale pricing through the weekend only.",
  "surat-belt":
    "Harness belt in vegetable-tanned leather with solid brass buckle. Sized true—order your usual trouser waist.",
  "madras-passport-cover":
    "Passport sleeve with pen loop and boarding-pass slot. Monsoon collection uses treated exterior leather.",
  "stone-desk-pad":
    "Natural stone surface with leather backing for desk organization. Each piece varies slightly in grain.",
  "goa-loafer":
    "Hand-stitched loafer with leather sole and cushioned insole. Breaks in over a week of light wear.",
  "monsoon-derby":
    "Derby with storm welt and rubber island sole. Our most requested rainy-season formal shoe.",
  "atelier-sandal":
    "Slide sandal with contoured footbed—almost sold through in cognac.",
  "evening-clutch":
    "Slim clutch with interior mirror and detachable chain. Fits phone, keys, and lipstick without bulge.",
  "heritage-duffel":
    "Large duffel with trolley sleeve and detachable shoulder strap. Built for weekend shoots and short-haul flights.",
  "linen-scarf":
    "Lightweight linen scarf with hand-rolled edges. Softens structured outerwear without added warmth.",
  "travel-organizer":
    "Zip organizer with cable loops and passport slot. On sale while we refresh the monsoon colorway.",
  "wool-shawl-coat":
    "Shawl-collar coat in double-faced wool. Drapes cleanly over the Deccan blazer for travel days.",
  "brass-candle-set":
    "Pair of cast brass candle holders with cotton tapers included. For entryways and bedside tables.",
};

const specsDefault = {
  material: "Full-grain leather or natural fibre as noted",
  dimensions: "See product imagery for scale",
  care: "Store dry; condition leather quarterly",
  origin: "Designed in Mumbai; crafted in India",
};

export const products: Product[] = seeds.map(
  ([slug, name, price, compare, cat, coll, badge, stock, colors, sizes], i) => ({
    id: `ksh-${String(i + 1).padStart(3, "0")}`,
    slug,
    name,
    description: descriptions[slug] ?? "A Kashu piece made in small batches for daily use.",
    priceInr: price,
    compareAtInr: compare,
    categorySlug: cat,
    collectionSlug: coll,
    colors,
    sizes,
    badge,
    stock,
    rating: 4.2 + (i % 8) * 0.1,
    reviewCount: 12 + i * 3,
    images: [
      img(
        [
          "photo-1548036492-050b0f08d920",
          "photo-1553062407-98eeb64c6a62",
          "photo-1551028719-00167b16eac5",
          "photo-1624222247344-550fb60583fd",
        ][i % 4]
      ),
      img("photo-1520639882103-09665fc45a87"),
    ],
    specs: specsDefault,
  })
);
