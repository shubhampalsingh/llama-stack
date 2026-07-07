// The ToysVill catalog. Edit this file to change what the store sells —
// no database needed. Prices in cents (USD).

export interface Toy {
  slug: string;
  name: string;
  emoji: string; // placeholder art until real photos exist (see README)
  tile: string; // background tint for the product tile
  priceCents: number;
  ages: string;
  category: Category;
  blurb: string;
  description: string;
}

export const CATEGORIES = ["Wooden Classics", "Puzzles", "Plushies", "Little Learners"] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATALOG: Toy[] = [
  {
    slug: "rainbow-block-set",
    name: "Rainbow Block Set",
    emoji: "🌈",
    tile: "#ffe3e3",
    priceCents: 3400,
    ages: "1–6",
    category: "Wooden Classics",
    blurb: "48 hand-sanded beechwood blocks in six sunny colors.",
    description:
      "The classic that never quits. Forty-eight chunky beechwood blocks, hand-sanded silky-smooth and finished with child-safe water-based paint in six colors. Towers, castles, cities, chaos — all included. Packed in a cotton drawstring bag for (optimistic) tidy-up time.",
  },
  {
    slug: "village-stacking-train",
    name: "Village Stacking Train",
    emoji: "🚂",
    tile: "#dff1ff",
    priceCents: 2800,
    ages: "1–4",
    category: "Wooden Classics",
    blurb: "A pull-along engine with stackable cargo shapes.",
    description:
      "Three carriages, one proud little engine, and a load of stackable geometric cargo. Pull it, stack it, derail it dramatically. Solid rubberwood with rounded corners and wheels that survive stairs (tested extensively, involuntarily).",
  },
  {
    slug: "woodland-marble-run",
    name: "Woodland Marble Run",
    emoji: "🌰",
    tile: "#eae7d6",
    priceCents: 5200,
    ages: "4–99",
    category: "Wooden Classics",
    blurb: "A 40-piece forest-themed marble run in solid maple.",
    description:
      "Ramps, funnels, a spinning leaf wheel and a chime bridge — forty pieces of solid maple that click together any way small architects decide. Comes with twelve glass marbles and a fabric pouch. Warning: adults will 'help' more than necessary.",
  },
  {
    slug: "hedgehog-balance-game",
    name: "Hedgehog Balance Game",
    emoji: "🦔",
    tile: "#ffeccc",
    priceCents: 2200,
    ages: "3–8",
    category: "Wooden Classics",
    blurb: "Stack the spines on the wobbliest hedgehog in the village.",
    description:
      "Herbert the hedgehog wobbles. Your job: stack all fourteen wooden spines on his back before he shrugs them off. A steady-hand game the whole family can lose gracefully. Solid beech, dice included, tantrums optional.",
  },
  {
    slug: "map-of-the-village-puzzle",
    name: "Map of the Village Puzzle",
    emoji: "🗺️",
    tile: "#e2f4e0",
    priceCents: 2600,
    ages: "4–8",
    category: "Puzzles",
    blurb: "A 100-piece storybook map with hidden characters to find.",
    description:
      "One hundred sturdy pieces build a storybook map of ToysVill — bakery, pond, toy shop and all. Then the second game starts: find the seventeen hidden characters listed on the box. Thick board pieces that survive enthusiastic assembly.",
  },
  {
    slug: "night-sky-floor-puzzle",
    name: "Night Sky Floor Puzzle",
    emoji: "🌙",
    tile: "#e3e0f5",
    priceCents: 3000,
    ages: "3–7",
    category: "Puzzles",
    blurb: "A big glow-in-the-dark constellation puzzle, 48 pieces.",
    description:
      "Four feet of night sky for the bedroom floor. Forty-eight extra-large pieces show the constellations — and after lights-out, the stars actually glow. Somehow makes bedtime a selling point.",
  },
  {
    slug: "tangram-treasure-box",
    name: "Tangram Treasure Box",
    emoji: "🔷",
    tile: "#dff1ff",
    priceCents: 1800,
    ages: "5–99",
    category: "Puzzles",
    blurb: "Seven walnut tangram pieces, 60 challenge cards.",
    description:
      "Seven pieces of oiled walnut, sixty challenge cards from 'gentle' to 'grandmaster', and one satisfying wooden box with a sliding lid. The thousand-year-old puzzle that still beats screens.",
  },
  {
    slug: "bramble-the-bear",
    name: "Bramble the Bear",
    emoji: "🧸",
    tile: "#f5e3d3",
    priceCents: 3200,
    ages: "0–99",
    category: "Plushies",
    blurb: "A honey-colored bear with corduroy paws. The mayor of naps.",
    description:
      "Bramble is stuffed to regulation squish with recycled fill, wears corduroy paw pads, and maintains a firm pro-nap policy. Machine washable, because we know where he's going to be dragged. The unofficial mayor of ToysVill.",
  },
  {
    slug: "pip-the-pond-duck",
    name: "Pip the Pond Duck",
    emoji: "🦆",
    tile: "#fff3c4",
    priceCents: 2400,
    ages: "0–99",
    category: "Plushies",
    blurb: "A round velvet duck who squeaks on the third squeeze.",
    description:
      "Pip is round, velvet-soft, and squeaks only on the third squeeze — a design decision nobody can explain but everybody defends. Sized for one-hand carrying by very small hands with very big opinions.",
  },
  {
    slug: "counting-acorn-set",
    name: "Counting Acorn Set",
    emoji: "🐿️",
    tile: "#e2f4e0",
    priceCents: 2900,
    ages: "2–5",
    category: "Little Learners",
    blurb: "Sort, count and squirrel away 30 wooden acorns.",
    description:
      "Thirty wooden acorns in five colors, two squirrel-shaped tweezers, and a sorting tree. Counting, colors, and fine motor skills — disguised as helping a squirrel do groceries. Montessori-friendly and mercifully quiet.",
  },
  {
    slug: "first-hundred-board",
    name: "First Hundred Board",
    emoji: "💯",
    tile: "#ffe3e3",
    priceCents: 3600,
    ages: "4–8",
    category: "Little Learners",
    blurb: "The classic Montessori hundred board in cherry wood.",
    description:
      "One to one hundred, one satisfying tile at a time. A classic Montessori hundred board in smooth cherry wood, with a lid that doubles as a second workspace. The quiet twenty minutes you've heard legends about.",
  },
  {
    slug: "letter-lane-alphabet-set",
    name: "Letter Lane Alphabet Set",
    emoji: "🔤",
    tile: "#e3e0f5",
    priceCents: 2700,
    ages: "3–6",
    category: "Little Learners",
    blurb: "Chunky wooden letters with a matching picture card lane.",
    description:
      "Twenty-six chunky wooden letters and twenty-six picture cards that snap together like a little lane: A meets Apple, Z meets Zebra. Uppercase on one side, lowercase on the other, future spelling-bee champion not guaranteed but plausible.",
  },
];

export function toyBySlug(slug: string): Toy | undefined {
  return CATALOG.find((t) => t.slug === slug);
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
