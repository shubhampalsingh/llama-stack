// Static reading plans. Each day is a passage reference readable in ~10 minutes.

export interface ReadingPlan {
  id: string;
  name: string;
  emoji: string;
  description: string;
  days: { day: number; reference: string; note?: string }[];
}

function chapters(book: string, from: number, to: number, startDay = 1) {
  const out = [];
  for (let c = from, d = startDay; c <= to; c++, d++) {
    out.push({ day: d, reference: `${book} ${c}` });
  }
  return out;
}

export const PLANS: ReadingPlan[] = [
  {
    id: "john-21",
    name: "The Gospel of John in 21 Days",
    emoji: "📖",
    description:
      "One chapter a day through the most intimate portrait of Jesus — from 'In the beginning was the Word' to breakfast on the shore.",
    days: chapters("John", 1, 21),
  },
  {
    id: "psalms-comfort-14",
    name: "Psalms of Comfort (14 Days)",
    emoji: "🕊️",
    description:
      "Two weeks in the Psalms that generations have turned to in hard seasons — shepherd, refuge, and steadfast love.",
    days: [
      { day: 1, reference: "Psalm 23", note: "The Lord is my shepherd" },
      { day: 2, reference: "Psalm 27", note: "Whom shall I fear?" },
      { day: 3, reference: "Psalm 34", note: "Near to the brokenhearted" },
      { day: 4, reference: "Psalm 42", note: "As the deer pants" },
      { day: 5, reference: "Psalm 46", note: "A very present help" },
      { day: 6, reference: "Psalm 62", note: "My soul waits in silence" },
      { day: 7, reference: "Psalm 63", note: "Earnestly I seek you" },
      { day: 8, reference: "Psalm 84", note: "Better is one day" },
      { day: 9, reference: "Psalm 91", note: "Shelter of the Most High" },
      { day: 10, reference: "Psalm 103", note: "Bless the Lord, O my soul" },
      { day: 11, reference: "Psalm 121", note: "I lift up my eyes" },
      { day: 12, reference: "Psalm 130", note: "Out of the depths" },
      { day: 13, reference: "Psalm 139", note: "Searched me and known me" },
      { day: 14, reference: "Psalm 145", note: "Great is the Lord" },
    ],
  },
  {
    id: "sermon-mount-7",
    name: "The Sermon on the Mount (7 Days)",
    emoji: "⛰️",
    description:
      "A week inside the most famous sermon ever preached — Matthew 5–7, taken slowly.",
    days: [
      { day: 1, reference: "Matthew 5:1-16", note: "The Beatitudes" },
      { day: 2, reference: "Matthew 5:17-32", note: "Fulfilling the law" },
      { day: 3, reference: "Matthew 5:33-48", note: "Love your enemies" },
      { day: 4, reference: "Matthew 6:1-18", note: "The Lord's Prayer" },
      { day: 5, reference: "Matthew 6:19-34", note: "Do not be anxious" },
      { day: 6, reference: "Matthew 7:1-14", note: "Ask, seek, knock" },
      { day: 7, reference: "Matthew 7:15-29", note: "Built on the rock" },
    ],
  },
  {
    id: "beginnings-30",
    name: "Beginnings: Genesis 1–Exodus 15 (30 Days)",
    emoji: "🌅",
    description:
      "Creation to the crossing of the sea — the sweeping opening arc of the whole story, a chapter or two a day.",
    days: [
      ...chapters("Genesis", 1, 3),
      { day: 4, reference: "Genesis 6-7", note: "The flood" },
      { day: 5, reference: "Genesis 8-9", note: "The rainbow covenant" },
      { day: 6, reference: "Genesis 11-12", note: "Babel and the call of Abram" },
      { day: 7, reference: "Genesis 15", note: "Count the stars" },
      { day: 8, reference: "Genesis 17-18", note: "The covenant and the visitors" },
      { day: 9, reference: "Genesis 21-22", note: "Isaac" },
      { day: 10, reference: "Genesis 24", note: "A wife for Isaac" },
      { day: 11, reference: "Genesis 25:19-34", note: "Jacob and Esau" },
      { day: 12, reference: "Genesis 27-28", note: "The blessing and the ladder" },
      { day: 13, reference: "Genesis 29-30", note: "Leah and Rachel" },
      { day: 14, reference: "Genesis 32-33", note: "Wrestling at Peniel" },
      { day: 15, reference: "Genesis 37", note: "Joseph the dreamer" },
      { day: 16, reference: "Genesis 39-40", note: "Potiphar's house and prison" },
      { day: 17, reference: "Genesis 41", note: "Pharaoh's dreams" },
      { day: 18, reference: "Genesis 42-43", note: "Brothers in Egypt" },
      { day: 19, reference: "Genesis 44-45", note: "I am Joseph" },
      { day: 20, reference: "Genesis 50", note: "Meant for good" },
      { day: 21, reference: "Exodus 1-2", note: "A baby in the reeds" },
      { day: 22, reference: "Exodus 3-4", note: "The burning bush" },
      { day: 23, reference: "Exodus 5-6", note: "Let my people go" },
      { day: 24, reference: "Exodus 7-8", note: "The plagues begin" },
      { day: 25, reference: "Exodus 9-10", note: "The plagues continue" },
      { day: 26, reference: "Exodus 11-12", note: "Passover" },
      { day: 27, reference: "Exodus 13", note: "Consecrate the firstborn" },
      { day: 28, reference: "Exodus 14", note: "The sea parts" },
      { day: 29, reference: "Exodus 15:1-21", note: "The song of the sea" },
      { day: 30, reference: "Psalm 105", note: "Looking back on it all" },
    ],
  },
];

export function planById(id: string): ReadingPlan | undefined {
  return PLANS.find((p) => p.id === id);
}

/** UTC day key. */
function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Streak = consecutive UTC days with any completed reading, ending today or yesterday. */
export function readingStreak(dates: Date[], now = new Date()): number {
  if (dates.length === 0) return 0;
  const days = new Set(dates.map(dayKey));
  const cursor = new Date(now);
  if (!days.has(dayKey(cursor))) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
    if (!days.has(dayKey(cursor))) return 0;
  }
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}
