// The four generator tools: shared config for UI and API.

export type ToolKind = "lesson" | "course" | "worksheet" | "week";

export type ToolConfig = {
  kind: ToolKind;
  path: string;
  emoji: string;
  name: string;
  tagline: string;
  topicLabel: string;
  topicPlaceholder: string;
  showDuration: boolean;
  durationOptions?: string[];
  system: string;
};

export const TOOLS: ToolConfig[] = [
  {
    kind: "lesson",
    path: "/lesson",
    emoji: "📝",
    name: "Lesson Plan",
    tagline: "A complete, ready-to-teach lesson plan in 30 seconds.",
    topicLabel: "Lesson topic",
    topicPlaceholder: "e.g. Introduction to fractions, The water cycle, Persuasive writing…",
    showDuration: true,
    durationOptions: ["30 minutes", "45 minutes", "60 minutes", "90 minutes"],
    system: `You write outstanding lesson plans for teachers and homeschooling parents. Output well-structured markdown with these sections (## headings): Learning objectives (3-4, observable verbs), Materials (only what's genuinely needed), Hook (2-3 minutes, genuinely engaging), Main activities (numbered, with minute allocations that sum to the requested duration, mixing instruction / practice / discussion), Quick assessment (how to check understanding in the room), Differentiation (one "needs support" and one "needs challenge" adaptation), and Optional homework. Be concrete: real questions to ask, real examples to use — never "discuss the topic". Match depth and tone to the grade level.`,
  },
  {
    kind: "course",
    path: "/course",
    emoji: "📚",
    name: "Course Builder",
    tagline: "A full multi-week curriculum: units, lessons, and outcomes.",
    topicLabel: "Course subject",
    topicPlaceholder: "e.g. Creative writing for beginners, Python for kids, World geography…",
    showDuration: true,
    durationOptions: ["4 weeks", "6 weeks", "8 weeks", "12 weeks"],
    system: `You design complete courses for teachers and homeschooling parents. Output well-structured markdown: start with ## Course overview (2-3 sentences + who it's for), ## Learning outcomes (what learners can DO at the end, 4-6 bullets), then one ## Week N: <theme> section per week, each containing 2-3 lessons as ### Lesson: <title> with a 2-3 sentence summary of content and the main activity. End with ## Assessment ideas (2-3 ways to measure progress across the course) and ## Materials & resources. Progression must build logically week over week — reference earlier weeks where natural. Match the grade level.`,
  },
  {
    kind: "worksheet",
    path: "/worksheet",
    emoji: "🖨️",
    name: "Worksheet Maker",
    tagline: "Printable worksheets with a separate answer key.",
    topicLabel: "Worksheet topic",
    topicPlaceholder: "e.g. Two-digit multiplication, Parts of a plant, French greetings…",
    showDuration: false,
    system: `You create excellent printable worksheets. The "markdown" field is the STUDENT worksheet: a title line, a one-line instruction, then 8-12 numbered exercises appropriate to the grade level — vary the exercise types (not 12 identical drills): include some straightforward practice, some applied/word problems, and one fun challenge at the end marked "⭐ Challenge". Leave answer space implied — never include answers. The "answerKey" field is the TEACHER answer key: the same numbered list with concise correct answers (and one-line working where useful). Plain-text math (/ for division, ^ for powers).`,
  },
  {
    kind: "week",
    path: "/week",
    emoji: "🏡",
    name: "Homeschool Week",
    tagline: "A balanced, realistic week of home learning.",
    topicLabel: "Focus or theme (optional themes welcome)",
    topicPlaceholder: "e.g. General week for age 8, Space theme, Catch-up week on reading & math…",
    showDuration: false,
    system: `You plan balanced homeschool weeks for parents. Output well-structured markdown: a short intro paragraph (what the week achieves, expected daily time), then one ## <Day> section for Monday-Friday. Each day: a bullet list of 3-5 learning blocks in the form "**Subject (minutes)** — specific activity" mixing core skills (reading, writing, math), one science-or-social block, one creative/physical block. Activities must be doable at home with common materials, be specific (the actual book type, the actual experiment), and include at least one screen-free hands-on activity daily. End with ## Tips for the week (3 short, encouraging, practical tips) and ## Supplies to gather. Keep total daily time realistic for the age.`,
  },
];

export function toolByKind(kind: string): ToolConfig | undefined {
  return TOOLS.find((t) => t.kind === kind);
}

export const GRADE_LEVELS = [
  "Preschool (3-5)",
  "Early primary (5-7)",
  "Primary (7-10)",
  "Middle school (10-13)",
  "High school (13-17)",
  "Adult learners",
];
