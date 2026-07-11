export type Glasses = {
  slug: string;
  name: string;
  brand: string;
  price: number; // USD MSRP
  tagline: string;
  gamingScore: number; // out of 10, our editorial gaming score
  award?: string;
  specs: {
    display: string;
    resolution: string;
    refresh: string;
    brightness: string;
    fov: string;
    weight: string;
    audio: string;
    tracking: string;
  };
  compat: {
    steamDeck: string;
    switch: string;
    console: string; // PS5 / Xbox via remote-cloud
    cloud: string;
    phone: string;
  };
  pros: string[];
  cons: string[];
  verdict: string;
  buyUrl: string; // swap for affiliate links
};

export const GLASSES: Glasses[] = [
  {
    slug: "viture-beast",
    name: "Viture Beast",
    brand: "Viture",
    price: 549,
    tagline: "The gaming-first flagship — HDR punch, 120Hz, and the best ecosystem of docks and controllers.",
    gamingScore: 9.3,
    award: "🏆 Best for gaming overall",
    specs: {
      display: "Sony Micro-OLED (per eye)",
      resolution: "1200p per eye",
      refresh: "120Hz",
      brightness: "1,250 nits (HDR)",
      fov: "58°",
      weight: "88 g",
      audio: "Open-ear stereo",
      tracking: "3DoF via app",
    },
    compat: {
      steamDeck: "Plug-and-play over USB-C DP Alt Mode — the classic pairing.",
      switch: "Best-in-class: Viture makes the only Switch 2-compatible dock.",
      console: "PS Remote Play and Xbox apps supported via the mobile ecosystem.",
      cloud: "Xbox Cloud Gaming, GeForce NOW, Steam Link — Viture leans hard into the cloud rig.",
      phone: "USB-C DP Alt Mode Androids and iPhone 15+; purpose-built mobile controller available.",
    },
    pros: [
      "Highest-brightness HDR picture in its class (1,250 nits)",
      "120Hz with genuinely low latency",
      "The only Switch 2 dock, plus first-party mobile controllers",
      "Lightweight for the spec (88 g)",
    ],
    cons: [
      "Ecosystem accessories add up fast",
      "58° FOV is good, not category-leading forever",
    ],
    verdict:
      "If gaming is the reason you're buying display glasses, the Beast is the safest money in 2026. The picture is bright and fast, and no other brand matches the dock + controller ecosystem — it's the closest thing to a portable console setup that fits in a sunglasses case. IGN's first XR review pick, and it earns it.",
    buyUrl: "#",
  },
  {
    slug: "xreal-one-pro",
    name: "XREAL One Pro",
    brand: "XREAL",
    price: 599,
    tagline: "The premium all-rounder with on-board 3DoF and a 57° field of view.",
    gamingScore: 9.0,
    award: "🥇 Best premium pick",
    specs: {
      display: "Micro-OLED (per eye)",
      resolution: "1080p per eye",
      refresh: "120Hz",
      brightness: "700 nits",
      fov: "57°",
      weight: "87 g",
      audio: "Bose-tuned open-ear",
      tracking: "Native 3DoF (X1 chip, ~3ms motion-to-photon)",
    },
    compat: {
      steamDeck: "Excellent — stable anchored screen thanks to the on-board X1 chip.",
      switch: "Works with a powered USB-C adapter/dock (Switch 1); Switch 2 via compatible docks.",
      console: "PS5/Xbox via remote play apps on phone, or HDMI→USB-C adapters.",
      cloud: "GeForce NOW, Xbox Cloud — smooth at 120Hz.",
      phone: "USB-C DP Alt Mode; anchor mode is superb for stationary play.",
    },
    pros: [
      "Chip-on-glasses 3DoF: the most stable anchored screen, no app needed",
      "~3ms latency at 120Hz — feels like a monitor",
      "Bose audio is the best sound on any gaming glasses",
    ],
    cons: [
      "700 nits falls behind the HDR crowd outdoors",
      "$599 before you've bought any adapters",
    ],
    verdict:
      "The One Pro is the glasses that feel most like a finished product: plug in, the screen locks in space, the sound is great, the latency is imperceptible. Gamers who want a giant stable display — especially Steam Deck owners — will be very happy. HDR-hunters should look at the Beast or RayNeo.",
    buyUrl: "#",
  },
  {
    slug: "rayneo-air-4-pro",
    name: "RayNeo Air 4 Pro",
    brand: "RayNeo",
    price: 299,
    tagline: "The value king — HDR10 certification and 1,200 nits for half the flagship price.",
    gamingScore: 8.7,
    award: "💸 Best value",
    specs: {
      display: "Micro-OLED (per eye)",
      resolution: "1080p per eye",
      refresh: "120Hz",
      brightness: "1,200 nits (HDR10 certified)",
      fov: "~52°",
      weight: "76 g",
      audio: "B&O-tuned speakers",
      tracking: "Software 3DoF",
    },
    compat: {
      steamDeck: "Plug-and-play USB-C; HDR10 makes Deck OLED-class colors on a huge screen.",
      switch: "Via powered dock/adapter.",
      console: "Remote play apps or HDMI→USB-C capture adapters.",
      cloud: "All major services via phone; great budget cloud rig.",
      phone: "USB-C DP Alt Mode; the lightest option here at 76 g.",
    },
    pros: [
      "First consumer AR glasses with HDR10 certification",
      "$299 — genuinely half the price of the flagships",
      "Lightest of the gaming-capable options",
      "B&O audio punches above the price",
    ],
    cons: [
      "Software-only tracking is less stable than XREAL's chip",
      "Narrower FOV than Beast/One Pro",
    ],
    verdict:
      "The Air 4 Pro is the answer to 'are these worth it?' for most people. HDR10 at 1,200 nits at $299 embarrasses some pricier rivals, and for pure plug-in-and-play-your-Deck gaming, you give up surprisingly little. Spend the savings on a good dock.",
    buyUrl: "#",
  },
  {
    slug: "rokid-ar-lite",
    name: "Rokid AR Lite",
    brand: "Rokid",
    price: 749,
    tagline: "The picture-quality obsessive's choice — 1200p and reference-class audio.",
    gamingScore: 8.3,
    award: "🎬 Best display & audio",
    specs: {
      display: "Micro-OLED (per eye)",
      resolution: "1200p per eye",
      refresh: "90Hz",
      brightness: "600 nits",
      fov: "50°",
      weight: "75 g (glasses)",
      audio: "HiFi speakers — class-leading",
      tracking: "3DoF via Station host",
    },
    compat: {
      steamDeck: "Works over USB-C; 90Hz cap vs 120Hz rivals.",
      switch: "Via the Station 2 host device or powered adapters.",
      console: "Remote play; Station 2 doubles as an Android TV-style hub.",
      cloud: "Strong — the bundled Station 2 host makes it a standalone cloud machine.",
      phone: "USB-C DP Alt Mode.",
    },
    pros: [
      "Best-in-class display sharpness and audio",
      "Station 2 host = self-contained entertainment system",
      "Very light and comfortable for long sessions",
    ],
    cons: [
      "90Hz and 600 nits trail the gaming-first rivals",
      "Priciest of the mainstream options",
    ],
    verdict:
      "The AR Lite is really a cinema device that games competently. If your split is 70% movies/shows, 30% games, its picture and sound will make you happiest — but pure gamers get more per dollar from Viture, XREAL or RayNeo.",
    buyUrl: "#",
  },
  {
    slug: "viture-luma-pro",
    name: "Viture Luma Pro",
    brand: "Viture",
    price: 499,
    tagline: "The Beast's slimmer sibling — sharper resolution focus, same great ecosystem.",
    gamingScore: 8.5,
    specs: {
      display: "Sony Micro-OLED (per eye)",
      resolution: "1200p per eye",
      refresh: "120Hz",
      brightness: "1,000 nits",
      fov: "52°",
      weight: "78 g",
      audio: "Open-ear stereo",
      tracking: "3DoF via app",
    },
    compat: {
      steamDeck: "Plug-and-play USB-C.",
      switch: "Full Viture dock ecosystem including Switch 2 support.",
      console: "Remote play apps.",
      cloud: "Xbox Cloud, GFN, Steam Link — same cloud story as the Beast.",
      phone: "USB-C DP Alt Mode + iPhone 15+; myopia adjustment dials built in.",
    },
    pros: [
      "1200p sharpness at a mid-tier price",
      "Built-in myopia (diopter) adjustment — no prescription inserts needed",
      "Same dock/controller ecosystem as the Beast",
    ],
    cons: [
      "Smaller FOV and dimmer than the Beast",
      "Software tracking only",
    ],
    verdict:
      "The sensible Viture. You lose the Beast's FOV and peak HDR but keep the ecosystem, the 120Hz smoothness and the crisp 1200p panel — and the diopter dials are a quiet killer feature for glasses-wearers who game.",
    buyUrl: "#",
  },
  {
    slug: "xreal-one",
    name: "XREAL One",
    brand: "XREAL",
    price: 449,
    tagline: "Chip-stabilized 3DoF and 120Hz at a friendlier price than the Pro.",
    gamingScore: 8.4,
    specs: {
      display: "Micro-OLED (per eye)",
      resolution: "1080p per eye",
      refresh: "120Hz",
      brightness: "600 nits",
      fov: "50°",
      weight: "84 g",
      audio: "Open-ear stereo",
      tracking: "Native 3DoF (X1 chip)",
    },
    compat: {
      steamDeck: "Excellent — same anchored-screen stability as the Pro.",
      switch: "Powered dock/adapter required.",
      console: "Remote play apps or HDMI adapters.",
      cloud: "All major services.",
      phone: "USB-C DP Alt Mode.",
    },
    pros: [
      "On-board X1 chip stability without the Pro price",
      "120Hz, ~3ms latency",
      "Frequent street prices under $400",
    ],
    cons: [
      "50° FOV and 600 nits are the compromise",
      "Audio a clear step below the Pro's Bose tuning",
    ],
    verdict:
      "The best 'serious but sane' pick: you get XREAL's real differentiator — the chip-anchored screen — while skipping the Pro tax. For Steam Deck couch sessions it's hard to beat per dollar.",
    buyUrl: "#",
  },
  {
    slug: "rog-xreal-r1",
    name: "ROG × XREAL R1",
    brand: "ASUS ROG / XREAL",
    price: 699,
    tagline: "The esports experiment — 240Hz micro-OLED made for ROG handhelds.",
    gamingScore: 8.0,
    award: "⚡ Fastest refresh",
    specs: {
      display: "Micro-OLED (per eye)",
      resolution: "1080p per eye",
      refresh: "240Hz",
      brightness: "600 nits",
      fov: "50°",
      weight: "~85 g",
      audio: "Open-ear stereo",
      tracking: "Native 3DoF",
    },
    compat: {
      steamDeck: "Works, but tuned for ROG Ally — pair with an Ally for the 240Hz path.",
      switch: "Via adapters; wasted refresh headroom.",
      console: "Remote play only.",
      cloud: "Supported, capped by stream framerates.",
      phone: "USB-C DP Alt Mode.",
    },
    pros: [
      "240Hz — nothing else on faces comes close",
      "Deep ROG Ally integration",
      "XREAL optics and tracking under the hood",
    ],
    cons: [
      "Very few sources can actually feed 240Hz",
      "Niche pricing for a niche audience",
    ],
    verdict:
      "A statement piece for competitive handheld players. If you own a ROG Ally and care about frame times more than HDR, it's genuinely unique — everyone else should buy the Beast or One Pro and pocket the difference.",
    buyUrl: "#",
  },
];

export function glassesBySlug(slug: string): Glasses | undefined {
  return GLASSES.find((g) => g.slug === slug);
}
