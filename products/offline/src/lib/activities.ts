// The offline.diy activity library. Curated, editorial, screen-free.

export type Cat = "make" | "move" | "connect" | "quiet";
export type People = "solo" | "together" | "family";
export type Place = "indoors" | "outdoors" | "anywhere";
export type Energy = "chill" | "medium" | "high";

export const CATS: { id: Cat; label: string; emoji: string; blurb: string }[] = [
  { id: "make", label: "Make", emoji: "🛠️", blurb: "Hands busy, mind quiet — build, cook, craft, fix." },
  { id: "move", label: "Move", emoji: "🏃", blurb: "Get the body going without a fitness app watching." },
  { id: "connect", label: "Connect", emoji: "🫂", blurb: "People, face to face, the original social network." },
  { id: "quiet", label: "Quiet", emoji: "🌿", blurb: "Slow down. Notice things. Do gloriously little." },
];

export type Activity = {
  slug: string;
  title: string;
  cat: Cat;
  blurb: string;
  steps: string[];
  minutes: number; // typical
  people: People;
  place: Place;
  free: boolean;
  energy: Energy;
};

export const ACTIVITIES: Activity[] = [
  // ---- MAKE ----
  { slug: "bake-bread", title: "Bake a loaf from scratch", cat: "make", blurb: "Flour, water, salt, yeast — and three hours that smell incredible.", steps: ["Mix 500g flour, 350ml warm water, 7g yeast, 10g salt", "Knead 10 minutes; rest 1-2 hours till doubled", "Shape, rest 30 min, bake ~35 min at 220°C", "Eat the first slice warm; no photo required"], minutes: 180, people: "solo", place: "indoors", free: false, energy: "medium" },
  { slug: "letter-writing", title: "Write a real letter", cat: "make", blurb: "Someone you love gets ink-on-paper proof you thought of them.", steps: ["Pick a person who'd never expect it", "One page, pen, no drafts — crossing out is charming", "Add one memory only the two of you share", "Post it. The stamp is the point"], minutes: 40, people: "solo", place: "anywhere", free: true, energy: "chill" },
  { slug: "fix-something", title: "Fix one broken thing", cat: "make", blurb: "That wobbly chair or ripped seam has been waiting months for you.", steps: ["Pick the thing you keep ignoring", "Take it apart slowly; lay parts in order", "Fix, glue, sew, or tighten what failed", "Use it, smugly, for years"], minutes: 60, people: "solo", place: "indoors", free: true, energy: "medium" },
  { slug: "cook-grandma", title: "Cook a family recipe from memory", cat: "make", blurb: "Call the person who makes it best — landline energy — then cook it.", steps: ["Choose the dish that tastes like childhood", "Get the recipe by asking, not searching", "Cook it without a video running", "Serve it to someone; report back to the source"], minutes: 90, people: "family", place: "indoors", free: false, energy: "medium" },
  { slug: "sketch-hour", title: "Draw what's in front of you", cat: "make", blurb: "Badly is fine. Drawing badly is still seeing better.", steps: ["Any pen, any paper, sit anywhere", "Draw the nearest object for 10 minutes", "Then a window view, then a person (ask first)", "Date the page; keep the notebook"], minutes: 45, people: "solo", place: "anywhere", free: true, energy: "chill" },
  { slug: "paper-boats", title: "Build a paper fleet", cat: "make", blurb: "Fold ten boats, find water, hold a regatta of no consequence.", steps: ["Fold 10 paper boats (learn one fancy design)", "Find a puddle, pond, or bathtub", "Race them; commentate dramatically", "Award a leaf medal to the winner"], minutes: 30, people: "family", place: "outdoors", free: true, energy: "chill" },
  { slug: "pickle-something", title: "Pickle or preserve something", cat: "make", blurb: "Lemons, chillies, mangoes — bottle a season before it leaves.", steps: ["Pick one thing in season", "Find one simple brine or masala method", "Sterilize a jar; pack it; label with the date", "Wait the hard wait; taste in a week+"], minutes: 60, people: "solo", place: "indoors", free: false, energy: "chill" },
  { slug: "plant-corner", title: "Start a one-pot garden", cat: "make", blurb: "Mint, chillies, or tulsi — a living thing that needs you daily, gently.", steps: ["One pot, soil, seeds or a cutting", "Put it where you'll see it every morning", "Water it as your first offline act of the day", "Graduate to pot #2 when it forgives your mistakes"], minutes: 40, people: "solo", place: "anywhere", free: false, energy: "chill" },
  { slug: "zine-hour", title: "Make a one-page zine", cat: "make", blurb: "Fold one sheet into eight pages about anything you love.", steps: ["Fold A4 into an 8-page mini book (one cut)", "Pick a topic: your street, your top 5 anything", "Fill it with drawings, lists, and captions", "Make a copy for one friend"], minutes: 60, people: "solo", place: "indoors", free: true, energy: "chill" },
  // ---- MOVE ----
  { slug: "phone-free-walk", title: "The no-phone neighbourhood walk", cat: "move", blurb: "Same streets, but this time you'll actually see them.", steps: ["Leave the phone at home. Actually.", "Walk 30+ minutes with no destination", "Find three things you've never noticed", "Tell someone about the best one"], minutes: 40, people: "solo", place: "outdoors", free: true, energy: "chill" },
  { slug: "sunrise-mission", title: "Catch one sunrise properly", cat: "move", blurb: "Set an alarm, find east, watch the whole thing. No camera.", steps: ["Check sunrise time; set a mean alarm", "Get somewhere with open sky", "Watch start to finish; no screens", "Breakfast afterwards tastes earned"], minutes: 60, people: "solo", place: "outdoors", free: true, energy: "medium" },
  { slug: "old-school-games", title: "Revive a childhood street game", cat: "move", blurb: "Gully cricket, pitthu, kho-kho, hopscotch — the originals still work.", steps: ["Recruit 3+ people of any age", "Chalk, stone, or ball — improvise gear", "Play the version with your childhood rules", "Argue about the rules; that's part of it"], minutes: 90, people: "together", place: "outdoors", free: true, energy: "high" },
  { slug: "stairs-summit", title: "Summit your building", cat: "move", blurb: "Stairs to the top, water break, view. A tiny mountaineering career.", steps: ["Skip the lift for one full day, or", "Climb to your roof/top floor 3 rounds", "Stretch at the summit; enjoy the view", "Name your peak. You've earned that"], minutes: 25, people: "solo", place: "indoors", free: true, energy: "high" },
  { slug: "cycle-somewhere", title: "Cycle to a place you always drive", cat: "move", blurb: "Borrow a cycle if you must. Feel the distance for real.", steps: ["Pick a spot 15-30 min away", "Go early morning when roads are kind", "Buy one small thing there as proof", "Take the longer way home"], minutes: 75, people: "solo", place: "outdoors", free: true, energy: "high" },
  { slug: "park-picnic", title: "Full-production picnic", cat: "move", blurb: "Bedsheet, snacks, a pack of cards, zero agenda.", steps: ["Pack: sheet, food, cards, water, a book", "Claim shade in the nearest decent park", "Rule: phones stay in one zipped bag", "Stay past the moment you'd normally leave"], minutes: 150, people: "together", place: "outdoors", free: true, energy: "chill" },
  { slug: "swim-splash", title: "Find water and get in it", cat: "move", blurb: "Pool, sea, lake, or a bucket-and-mug session — water resets brains.", steps: ["Locate swimmable (safe!) water", "Get fully in; float on your back a while", "No laps required; play counts", "Chai after is mandatory"], minutes: 90, people: "together", place: "outdoors", free: false, energy: "medium" },
  // ---- CONNECT ----
  { slug: "board-game-night", title: "Host a board game night", cat: "connect", blurb: "Carrom, Ludo, chess, cards — rivalries are healthier than feeds.", steps: ["Invite 2-5 people for a fixed time", "Phones in a bowl by the door", "Snacks within arm's reach always", "Crown a champion; demand a rematch date"], minutes: 150, people: "together", place: "indoors", free: true, energy: "chill" },
  { slug: "grandparent-hour", title: "Interview an elder", cat: "connect", blurb: "One hour, real questions, their life before you existed.", steps: ["Visit or call a grandparent/elder neighbour", "Ask: first job? first city? best trouble?", "Write down the best three stories after", "Schedule the sequel — there's always more"], minutes: 60, people: "family", place: "anywhere", free: true, energy: "chill" },
  { slug: "no-phone-dinner", title: "The no-phone dinner table", cat: "connect", blurb: "One meal where everyone's hands are visible and eyes are up.", steps: ["Declare tonight's dinner screen-free", "Stack all phones face-down away from table", "Everyone answers: best + worst of the week", "Last one to reach for a phone does dishes"], minutes: 60, people: "family", place: "indoors", free: true, energy: "chill" },
  { slug: "chai-invite", title: "Invite a neighbour for chai", cat: "connect", blurb: "You've nodded at them for years. Upgrade the nod.", steps: ["Pick the neighbour you always mean to know", "Knock. Invite. (Terrifying for 4 seconds)", "Make proper chai; biscuits help", "Learn one real thing about their life"], minutes: 60, people: "together", place: "indoors", free: true, energy: "chill" },
  { slug: "letters-night", title: "Group letter-writing night", cat: "connect", blurb: "Friends, stationery, and everyone leaves with mail to send.", steps: ["Gather 3+ friends, paper, pens, stamps", "Everyone writes to someone not in the room", "Read favourite lines aloud (optional)", "Walk together to the postbox"], minutes: 90, people: "together", place: "indoors", free: true, energy: "chill" },
  { slug: "volunteer-morning", title: "Give a morning away", cat: "connect", blurb: "A shelter, a beach cleanup, a gurudwara langar — show up, help.", steps: ["Find one local effort that takes walk-ins", "Show up on time with work clothes", "Do the unglamorous task cheerfully", "Notice how the morning felt on the way home"], minutes: 180, people: "together", place: "outdoors", free: true, energy: "medium" },
  { slug: "story-swap", title: "Family story swap", cat: "connect", blurb: "Everyone tells one story the others haven't heard. Harder than it sounds.", steps: ["After dinner, lights low, phones away", "Each person: one never-told story", "No interrupting till the end", "Vote the best one; teller picks dessert"], minutes: 60, people: "family", place: "indoors", free: true, energy: "chill" },
  // ---- QUIET ----
  { slug: "bench-hour", title: "Sit on a bench for one hour", cat: "quiet", blurb: "The hardest activity on this site. Also the most famous-in-your-memory.", steps: ["Find a bench with something to watch", "No phone, no book, no podcast. Just sit", "Let the boredom crest around minute 15", "Stay. What's on the other side is the point"], minutes: 60, people: "solo", place: "outdoors", free: true, energy: "chill" },
  { slug: "library-visit", title: "Get lost in a library", cat: "quiet", blurb: "Wander shelves you'd never search. Serendipity beats algorithms.", steps: ["Go to any library or big bookshop", "Pick an aisle you know nothing about", "Choose a book by cover and first page only", "Read chapter one before you leave"], minutes: 90, people: "solo", place: "indoors", free: true, energy: "chill" },
  { slug: "cloud-watching", title: "Professional cloud watching", cat: "quiet", blurb: "Lie down, look up, appoint shapes. Ancient technology.", steps: ["Find grass, a roof, or a balcony", "Lie flat; watch clouds move for 20 min", "Name at least three shapes out loud", "Note which direction the sky is going"], minutes: 30, people: "family", place: "outdoors", free: true, energy: "chill" },
  { slug: "tea-ceremony", title: "Make chai like it's a ceremony", cat: "quiet", blurb: "Same chai, but you do nothing else while making or drinking it.", steps: ["Make chai slowly; watch it, smell it", "Sit somewhere good with the cup", "Do nothing else. Not one other thing", "Wash the cup as part of the ritual"], minutes: 30, people: "solo", place: "indoors", free: true, energy: "chill" },
  { slug: "journal-dump", title: "The 3-page brain dump", cat: "quiet", blurb: "Three pages, longhand, whatever comes. The backspace key can't save you.", steps: ["Pen + 3 blank pages, timer 30 min", "Write whatever crosses your mind, no editing", "Boring is allowed; keep the hand moving", "Don't reread today. Maybe next month"], minutes: 35, people: "solo", place: "anywhere", free: true, energy: "chill" },
  { slug: "temple-walk", title: "Visit a quiet sacred space", cat: "quiet", blurb: "Temple, church, gurudwara, mosque, or a very old tree — sit in old silence.", steps: ["Pick somewhere peaceful nearby", "Sit 20 minutes with no agenda", "Notice the sounds under the silence", "Leave slower than you arrived"], minutes: 45, people: "solo", place: "anywhere", free: true, energy: "chill" },
  { slug: "night-sky", title: "Actually look at the night sky", cat: "quiet", blurb: "Find the darkest spot you can reach and let your eyes adjust for real.", steps: ["Go to your darkest accessible spot", "Wait 15 min — eyes need that long", "Find the moon, one planet, one pattern", "Make up your own constellation name"], minutes: 45, people: "together", place: "outdoors", free: true, energy: "chill" },
  { slug: "single-task-meal", title: "Eat one meal with zero inputs", cat: "quiet", blurb: "No screen, no reading, no talking. Just you and the food. Weirdly hard.", steps: ["Plate the food properly", "Eat slowly; notice actual flavours", "Put the spoon down between bites", "Notice when you're full — a lost signal"], minutes: 30, people: "solo", place: "indoors", free: true, energy: "chill" },
];

export function activityBySlug(slug: string): Activity | undefined {
  return ACTIVITIES.find((a) => a.slug === slug);
}

export function catLabel(id: Cat): string {
  return CATS.find((c) => c.id === id)?.label ?? id;
}

export function catEmoji(id: Cat): string {
  return CATS.find((c) => c.id === id)?.emoji ?? "✳️";
}
