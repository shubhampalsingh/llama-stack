export type Guide = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  minutes: number;
  body: string; // markdown
};

export const GUIDES: Guide[] = [
  {
    slug: "gaming-on-smart-glasses-2026",
    title: "Gaming on smart glasses in 2026: what it actually is (and isn't)",
    category: "Start here",
    summary:
      "Forget the sci-fi renders. Here's what display glasses really do for gaming today — and why owners rarely go back.",
    minutes: 6,
    body: `The pitch sounds like marketing: "a 150-inch screen in your pocket." The reality is more mundane and more useful — **display glasses are a private, giant, lag-free monitor that weighs less than your phone**, and handheld gaming is their killer app.

## What you're actually buying

Modern gaming glasses (XREAL, Viture, RayNeo, Rokid) are **wearable displays**, not standalone computers. They have:

- Two micro-OLED panels (one per eye) that your brain fuses into a single huge virtual screen — the equivalent of 130–200 inches at a few meters
- USB-C input using **DisplayPort Alt Mode** — the same video-out your Steam Deck, ROG Ally, recent iPhones and most Android flagships already speak
- Open-ear speakers, so you still hear the doorbell
- On the better models: 120Hz refresh and single-digit-millisecond latency — this is NOT the laggy screen-mirroring of years past

What they are **not**: AR in the Iron Man sense. Games don't float on your coffee table (yet, with a handful of experimental exceptions). You're buying the world's most portable big screen.

## Why handheld players convert hardest

A Steam Deck or Switch is a compromise: great library, small screen, neck craned down. Plug in glasses and:

1. The screen becomes cinema-sized while the console stays in your lap
2. Your neck straightens out (genuinely the #1 thing owners mention)
3. Nobody on the plane/train/sofa sees what you're playing
4. Battery impact is modest — the glasses draw from the handheld, but panels this small are efficient

## The three setups that matter

- **Direct plug** — handheld/phone → USB-C cable → glasses. Zero extra gear if your device outputs DP Alt Mode.
- **Docked** — Switch and other HDMI-only devices need a dock or HDMI→USB-C adapter that *supplies power* (see our Switch guide).
- **The cloud rig** — phone + glasses + Bluetooth controller + Xbox Cloud/GeForce NOW. Console-quality gaming from a pocket (see the cloud guide).

## Should you wait?

The category is improving fast — but 2026 is the first year the good options are genuinely good: HDR panels, 120Hz standard, real ecosystems (docks, controllers). If you game on a handheld more than a few hours a week, the answer is usually no — this is the accessory that changes how it feels the most per dollar.

*Next: check the [rankings](/glasses) or jump to the setup guide for your device.*`,
  },
  {
    slug: "steam-deck-ar-glasses-setup",
    title: "Steam Deck + AR glasses: the complete setup guide",
    category: "Setup",
    summary:
      "The best pairing in portable gaming. Cables, settings, battery math, and the settings people miss.",
    minutes: 7,
    body: `The Steam Deck is the single most popular device to pair with display glasses — and the easiest. Here's the full setup.

## What you need

- Any USB-C display glasses (all seven in [our rankings](/glasses) work)
- The cable that came with them (USB-C 3.1+, full-featured)
- That's it. The Deck outputs DisplayPort Alt Mode natively.

## First-time setup (2 minutes)

1. Plug the glasses into the Deck's USB-C port. The Deck's screen keeps running; the glasses light up as a second display.
2. Press **Steam → Settings → Display**. Set the *external* display as primary, or use mirror mode if you want the Deck screen as a fallback.
3. Match refresh rate: if your glasses do 120Hz, set the external display to 120Hz and cap the framerate where each game can hold it (40–60fps caps still *feel* better on a 120Hz panel).
4. In the glasses' controls (buttons on the temple), set brightness ~60–70% indoors — you'll save meaningful battery.

## Battery math (the honest version)

Glasses draw ~1.5–3W from the Deck. In practice:

- Light indie games: you lose roughly 30–45 minutes of a full charge
- Heavy AAA: proportionally less impact (the GPU dominates)
- Fix: a small power bank with USB-C PD feeding the Deck's port via a pass-through hub restores everything and then some

## Settings people miss

- **Disable the Deck's internal screen** (in game mode display settings) when using glasses-primary — saves battery and stops accidental touch inputs.
- **Anchored vs follow mode**: XREAL's chip (One / One Pro) can pin the screen in space — superb seated, disorienting on a train. Use follow ("smooth follow") mode in vehicles.
- **Text size**: at a simulated 150", small fonts are readable — but bump Steam's UI scale one notch and thank us later.

## Troubleshooting

| Symptom | Fix |
|---|---|
| No image | Use the original cable; third-party USB-C cables often lack DP wires |
| Flicker | Set refresh to 90Hz — some early cables can't hold 120Hz reliably |
| Sound from Deck, not glasses | Steam → Settings → Audio → output device |
| Image drifts (3DoF models) | Recenter with the temple button; recalibrate on a still surface |`,
  },
  {
    slug: "switch-on-smart-glasses",
    title: "Nintendo Switch & Switch 2 on smart glasses: docks, adapters, gotchas",
    category: "Setup",
    summary:
      "The Switch is the trickiest console to pair — here's every working path for Switch 1 and Switch 2.",
    minutes: 6,
    body: `The Switch is the most-asked-about pairing and the most annoying one, because Nintendo's video-out is dock-bound. Here's what actually works.

## Why it's complicated

Display glasses want **USB-C DisplayPort Alt Mode**. The Switch 1 doesn't output that from its USB-C port directly — video only flows through dock-mode negotiation (power + HDMI). So you need hardware in between.

## Switch 1: two working paths

**Path A — third-party portable dock + HDMI→USB-C adapter.** A compact dock (with its own power) converts to HDMI; an adapter (with its own power input) converts HDMI to the USB-C DP signal glasses accept. Works, but you're carrying two dongles and a power bank.

**Path B — all-in-one glasses adapters.** Several brands sell single-box adapters made exactly for "Switch → glasses" (they handle dock handshake, power passthrough, and DP output). One cable in, one out, power in the middle. This is the sane option.

## Switch 2: dramatically better

The Switch 2's USB-C situation improved, and — the headline — **Viture ships the only Switch 2-compatible dock** purpose-built for glasses as of early 2026. If Switch 2 is your main machine, that single fact should weight your glasses choice toward Viture's ecosystem (Beast or Luma Pro).

## Handheld-mode reality check

Any path still requires power flowing to the Switch — budget for a PD power bank in the bag. Total kit: Switch + glasses + adapter + small bank ≈ still smaller and lighter than any laptop, with a 150-inch screen at the end of it.

## Recommendations

- **Switch 2 owner** → Viture Beast + Viture's Switch 2 dock. Done.
- **Switch 1, minimal fuss** → an all-in-one Switch-to-glasses adapter + any 120Hz glasses (the Switch outputs 60Hz anyway, so the RayNeo Air 4 Pro's value is compelling).
- **Own a Deck too?** → Prioritize the Deck experience (native, zero dongles) and treat Switch support as a bonus.`,
  },
  {
    slug: "cloud-gaming-rig-glasses",
    title: "The pocket cloud rig: phone + glasses + controller",
    category: "Setup",
    summary:
      "Xbox Cloud, GeForce NOW, PS Remote Play and Steam Link on a 150-inch private screen — from hardware you already own.",
    minutes: 7,
    body: `The most underrated setup in gaming right now: a phone you own, a Bluetooth controller you probably own, and display glasses. Result: AAA gaming on a giant screen, anywhere with decent internet.

## The stack

1. **Phone** — needs USB-C video-out (DP Alt Mode): most flagship Androids, iPhone 15 and later. (Check our device pages for per-phone notes.)
2. **Glasses** — any in [the rankings](/glasses); this is the least picky part.
3. **Controller** — any Bluetooth pad (Xbox, DualSense, or a phone-clip controller). Viture even makes a purpose-built mobile controller for exactly this rig.
4. **Service** — pick your poison:

| Service | What you get | Sweet spot |
|---|---|---|
| **Xbox Cloud Gaming** | Game Pass library, no console needed | Broadest zero-hardware option |
| **GeForce NOW** | Your own Steam/Epic PC library, up to very high tiers | PC gamers; best image quality |
| **PS Remote Play** | Your PS5, streamed from home | PS5 owners on the road |
| **Steam Link** | Your gaming PC, streamed over LAN/WAN | Best latency at home |

## Setup in five minutes

1. Pair the controller to the phone.
2. Plug the glasses into the phone.
3. Open the service's app — it renders to the glasses as an external display.
4. In the glasses, pick "follow" mode for commutes, anchored mode on the sofa.
5. Lock the phone's screen orientation and pocket it (test first: some apps pause on screen-off — use the phone's "keep awake while displaying" developer setting if needed).

## Latency expectations (honest)

- **Steam Link on home Wi-Fi**: excellent, play anything.
- **GFN / Xbox Cloud on good fiber**: single-player and casual multiplayer feel great; competitive shooters are playable but not tournament-grade.
- **Hotel/train Wi-Fi**: adventure/strategy/turn-based only. Download-heavy handhelds still win on terrible networks.

## Battery notes

The phone is doing decode + display output: expect ~15–20% per hour. A slim PD bank in the same pocket solves the anxiety. Some glasses accessories offer pass-through charging hubs — worth it if this becomes your daily setup.`,
  },
  {
    slug: "how-to-choose-gaming-glasses",
    title: "Buying guide: how to choose gaming glasses (the 6 specs that matter)",
    category: "Buying",
    summary:
      "FOV, nits, refresh, tracking, diopters, ecosystem — what each spec means in-game, and which ones are marketing.",
    minutes: 8,
    body: `Spec sheets for glasses are a minefield of numbers that sound important. Here's what actually changes your gaming experience, in order.

## 1. Refresh rate & latency (matters most)

120Hz is the 2026 standard on everything worth buying; the ROG × XREAL R1 pushes 240Hz for esports niches. But the hidden number is **motion-to-photon latency** — XREAL's chip-equipped models quote ~3ms, which is why their screens feel "attached" to reality. Anything advertising 60Hz-only in 2026: skip.

## 2. Brightness & HDR (matters more than resolution)

Micro-OLED contrast is spectacular across the board, so **peak nits** is where panels differ: 600 nits (fine indoors) vs 1,200+ nits (Viture Beast, RayNeo Air 4 Pro — punchy HDR, usable in bright rooms). If you play HDR-capable games on a Deck OLED or modern phone, HDR10 support is a real, visible upgrade.

## 3. Field of view (the immersion dial)

FOV decides how big the virtual screen feels: ~50° = big monitor; 57–58° (One Pro, Beast) = front-row cinema. Bigger isn't free — edges get harder to keep sharp — but for games, the top-FOV models are noticeably more immersive.

## 4. Tracking: chip vs software vs none

- **Chip 3DoF (XREAL One/One Pro)** — screen pins in space with zero setup; most stable.
- **App 3DoF (Viture, RayNeo)** — good, slightly more drift, needs their app.
- **None/follow-only** — screen glued to your face; actually *preferred* in vehicles.
If you mostly play seated at home, chip anchoring is a luxury you'll use daily.

## 5. Fit, weight, and diopters (the dealbreaker nobody benchmarks)

75–90 g feels trivial for 30 minutes and real after 3 hours — under 80 g wins marathons. If you wear prescription glasses: **Viture's built-in myopia dials** (Luma line) mean no prescription inserts; everyone else needs custom lens inserts (~$30–80 extra).

## 6. Ecosystem (the sleeper spec)

The glasses are half the product. Docks (Switch 2 → Viture only, today), mobile controllers, pass-through power hubs, multi-screen software — this is where Viture and XREAL pull away from cheaper rivals, and why the "best value" pick isn't automatically the best buy for *your* setup.

## The 30-second decision tree

- **"I mostly play Steam Deck/Ally, want the most stable screen"** → XREAL One Pro (or One, on a budget)
- **"I want the best gaming picture and will buy into an ecosystem"** → Viture Beast
- **"Cheapest way to find out if I love this"** → RayNeo Air 4 Pro
- **"Movies first, games second"** → Rokid AR Lite
- **"I own a ROG Ally and play shooters"** → ROG × XREAL R1
- **"Switch 2 is my main console"** → Viture (dock compatibility decides it)`,
  },
];

export function guideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
