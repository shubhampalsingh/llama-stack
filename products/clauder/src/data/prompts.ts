export type Prompt = {
  slug: string;
  title: string;
  category: string;
  description: string;
  content: string;
  community?: boolean;
  author?: string;
};

export const CATEGORIES = [
  "Coding",
  "Writing",
  "Business",
  "Learning",
  "Productivity",
  "Creative",
] as const;

export const PROMPTS: Prompt[] = [
  // ---------- Coding ----------
  {
    slug: "code-review-senior",
    title: "Senior-engineer code review",
    category: "Coding",
    description: "A rigorous review that finds real bugs, not style nits.",
    content: `Review the following code as a senior engineer who will be paged if it breaks in production.

Report every issue you find, including ones you are uncertain about — include your confidence and an estimated severity for each so I can rank them. Prioritize: correctness bugs, race conditions, unhandled edge cases, security problems, and misleading names or comments. Only mention style if it hides a bug.

For each finding give: the line/function, what goes wrong, a concrete input or scenario that triggers it, and the minimal fix.

<code>
[PASTE CODE HERE]
</code>`,
  },
  {
    slug: "debug-detective",
    title: "Debugging detective",
    category: "Coding",
    description: "Turns Claude into a methodical debugger instead of a guesser.",
    content: `You are debugging with me. Do not guess at fixes.

1. Read the error and code below and list the 3 most likely root causes, ranked, each with the evidence for and against it.
2. Tell me the single cheapest experiment (log line, test, command) that would distinguish between them.
3. Wait for my result before proposing the next step. One hypothesis at a time.

Error:
[PASTE ERROR]

Relevant code:
[PASTE CODE]`,
  },
  {
    slug: "explain-codebase",
    title: "Explain an unfamiliar codebase",
    category: "Coding",
    description: "Get oriented in a new repo in minutes.",
    content: `I just inherited this codebase and need to get productive fast. Based on the files I show you:

1. What is the architecture in one paragraph — entry points, main layers, and how data flows?
2. Which 5 files should I read first, in what order, and what will each teach me?
3. What conventions does this codebase follow that I must not break (naming, error handling, state management)?
4. What looks fragile or surprising — the places a newcomer is most likely to cause a bug?

[PASTE KEY FILES OR A FILE TREE HERE]`,
  },
  {
    slug: "sql-optimizer",
    title: "SQL query optimizer",
    category: "Coding",
    description: "Explains why a query is slow and rewrites it.",
    content: `Here is a slow SQL query, the schema of the tables involved, and (if I have it) the EXPLAIN output.

1. Explain in plain language why this query is slow — table scans, missing indexes, bad join order, N+1 shape.
2. Rewrite the query to be faster, preserving identical results.
3. Suggest indexes (exact CREATE INDEX statements) and predict which one matters most.
4. Point out anything that will get worse as the tables grow.

Query:
[PASTE QUERY]

Schema:
[PASTE SCHEMA]`,
  },
  // ---------- Writing ----------
  {
    slug: "ruthless-editor",
    title: "Ruthless editor",
    category: "Writing",
    description: "Cuts your draft by 30% and makes it sharper.",
    content: `Edit the draft below like a ruthless magazine editor. Your goals, in order:

1. Cut at least 25% of the words without losing any ideas. Kill throat-clearing, hedges, and repeated points.
2. Replace abstract claims with concrete specifics wherever the material allows.
3. Make the first sentence impossible to stop reading.

Return: the edited draft, then a short list of the biggest changes and why. Keep my voice — tighten it, don't replace it.

Draft:
[PASTE DRAFT]`,
  },
  {
    slug: "landing-page-copy",
    title: "Landing page copy that converts",
    category: "Writing",
    description: "Full landing page copy from a plain product description.",
    content: `Write landing page copy for the product below. Structure:

- Headline (≤9 words, benefit-first, no buzzwords)
- Subheadline (one sentence: who it's for + what changes for them)
- 3 benefit blocks (bold claim + 2 supporting sentences each)
- 1 objection-handling section ("Isn't this just…?")
- Social-proof placeholder with the right shape of testimonial to collect
- CTA button text (3 options)

Voice: confident, plain-spoken, zero hype words ("revolutionary", "seamless", "unleash" are banned).

Product: [DESCRIBE PRODUCT, AUDIENCE, AND THE #1 PAIN IT SOLVES]`,
  },
  {
    slug: "email-diplomat",
    title: "The email diplomat",
    category: "Writing",
    description: "Says the hard thing without burning the bridge.",
    content: `Help me write a difficult email. The situation: [DESCRIBE SITUATION — who, what went wrong, what I need from them].

Requirements:
- Say the hard thing clearly in the first 3 sentences — no burying the point.
- Keep the relationship intact: acknowledge their position once, without groveling.
- End with one specific, easy-to-say-yes-to next step and a deadline.
- Under 150 words.

Give me two versions: one firm, one warm. Label which situations each fits.`,
  },
  {
    slug: "story-doctor",
    title: "Story doctor",
    category: "Writing",
    description: "Diagnoses why your story/essay isn't landing.",
    content: `Read my piece below as a story doctor. Don't line-edit yet. Diagnose:

1. What is this piece actually about (one sentence)? Is that what I seem to think it's about?
2. Where does the energy die — the exact paragraph readers will skim or quit?
3. What is the strongest sentence, and what would the piece look like if it opened there?
4. What's missing — the scene, example, or admission that would make it 2x more honest?

Then give me a revision plan of at most 4 moves, ordered by impact.

[PASTE PIECE]`,
  },
  // ---------- Business ----------
  {
    slug: "devils-advocate",
    title: "Devil's advocate board member",
    category: "Business",
    description: "Stress-tests your plan before reality does.",
    content: `I'm going to describe a plan. Act as the toughest board member I could face — smart, skeptical, and on my side.

1. Steelman my plan back to me in 3 sentences so I know you understood it.
2. Attack it: the 3 assumptions most likely to be wrong, the failure mode I'm not pricing in, and the competitor response I'm ignoring.
3. Tell me the cheapest test that would prove or kill the riskiest assumption within 2 weeks.
4. End with your honest verdict: proceed, modify (how), or stop.

The plan: [DESCRIBE PLAN]`,
  },
  {
    slug: "pricing-strategist",
    title: "Pricing strategist",
    category: "Business",
    description: "Concrete pricing recommendation, not a lecture.",
    content: `Recommend pricing for my product. Inputs:

- Product: [WHAT IT DOES]
- Audience: [WHO BUYS, AND WITH WHOSE MONEY]
- Closest alternatives and their prices: [LIST]
- My costs per user (if relevant): [COST]

Deliver: a specific recommended price and packaging (tiers, what's in each), the psychological anchor to present it against, one experiment to validate it in 30 days, and the #1 mistake founders in my category make on pricing.`,
  },
  {
    slug: "meeting-to-action",
    title: "Meeting notes → decisions & actions",
    category: "Business",
    description: "Turns messy notes into a crisp record people actually read.",
    content: `Turn my raw meeting notes into a record with exactly these sections:

**Decisions made** — each one sentence, with who owns it.
**Actions** — table: action, owner, deadline (flag any that came without one as "⚠ no deadline set").
**Open questions** — things discussed but not resolved, each with the person who should resolve it.
**Not discussed** — anything on the agenda we skipped.

Do not summarize the discussion itself. If something is ambiguous in my notes, list it under Open questions rather than guessing.

Notes:
[PASTE NOTES]`,
  },
  {
    slug: "cold-outreach",
    title: "Cold outreach that gets replies",
    category: "Business",
    description: "Short, specific, un-ignorable first emails.",
    content: `Write a cold email to [ROLE] at [COMPANY TYPE] about [MY OFFER].

Rules:
- Under 90 words.
- First sentence must show I know something specific about them (leave a [RESEARCH] slot and tell me what to put in it).
- One idea only. No feature lists.
- The ask is a small yes ("worth a 15-min look?") not a meeting demand.
- No "I hope this finds you well", no "quick question", no flattery openers.

Give 3 variants with meaningfully different angles, and say which to A/B test first.`,
  },
  // ---------- Learning ----------
  {
    slug: "feynman-tutor",
    title: "Feynman-technique tutor",
    category: "Learning",
    description: "Learn anything by being forced to explain it.",
    content: `We're using the Feynman technique on: [TOPIC].

1. Ask me to explain it as if to a smart 12-year-old. Wait for my answer.
2. Find the exact spots where I hand-waved, used jargon as a hiding place, or was simply wrong. Show me each one.
3. Teach me just those gaps — nothing I already demonstrated I know.
4. Make me re-explain the full topic. Repeat until my explanation is airtight.

Keep each of your turns short. Never move to step 3 before I've genuinely attempted step 1.`,
  },
  {
    slug: "spaced-question-bank",
    title: "Question bank generator",
    category: "Learning",
    description: "Active-recall questions from any material you paste.",
    content: `From the material below, create an active-recall question bank:

- 10 questions ordered from basic recall to application to synthesis.
- For each: the question, the model answer (2-3 sentences max), and the page/section it came from.
- Then 3 "transfer" questions that apply the ideas to a situation NOT in the material.
- Flag the 2 concepts most likely to be confused with each other, and write one question specifically designed to separate them.

Material:
[PASTE NOTES / CHAPTER / ARTICLE]`,
  },
  {
    slug: "eli-ladder",
    title: "The explanation ladder",
    category: "Learning",
    description: "One concept, five levels of depth.",
    content: `Explain [CONCEPT] five times, at increasing depth:

1. To a 8-year-old (2 sentences, one everyday analogy)
2. To a high schooler (add the mechanism)
3. To a college student in the field (proper terminology, key equation or model if any)
4. To a practitioner (edge cases, where the simple model breaks)
5. To a skeptic (the strongest criticism of the concept and its best defense)

Keep each level under 100 words. Bold the one sentence per level that matters most.`,
  },
  {
    slug: "study-plan-architect",
    title: "Study plan architect",
    category: "Learning",
    description: "A realistic plan built around your actual schedule.",
    content: `Build me a study plan.

- Goal: [EXAM/SKILL + TARGET DATE]
- Current level: [HONEST ASSESSMENT]
- Time available: [HOURS/WEEK AND WHEN]
- Past failure mode: [WHY PREVIOUS ATTEMPTS DIED — be honest]

Requirements: week-by-week plan with specific topics; every session ends with 10 minutes of active recall on earlier material; one weekly "catch-up buffer" slot; a plan-B week for when life happens (because it will); and a simple weekly self-test so I know if I'm on track. Design around my failure mode explicitly.`,
  },
  // ---------- Productivity ----------
  {
    slug: "week-planner",
    title: "Sunday-evening week planner",
    category: "Productivity",
    description: "Turns a brain-dump into a realistic week.",
    content: `Here's everything on my plate: [BRAIN-DUMP EVERYTHING — tasks, worries, deadlines, half-ideas].

1. Sort it: this week / later / delegate / delete. Be aggressive with "delete" and tell me why for each.
2. For "this week": pick the ONE thing that, if done, makes the week a win. Schedule it first.
3. Lay out the week assuming I have [N] real focus hours per day (not 8 — be honest).
4. Identify the task I'm most likely to procrastinate on and break its first step down to something under 10 minutes.`,
  },
  {
    slug: "decision-one-pager",
    title: "Decision one-pager",
    category: "Productivity",
    description: "Stop ruminating; decide on paper.",
    content: `Help me make this decision: [DESCRIBE DECISION AND OPTIONS].

Build a one-pager:
- The decision in one sentence, with the real deadline for making it.
- What I'm actually optimizing for (infer it from how I described the problem, then check with me).
- Options table: option, best case, worst case, reversibility (easy/hard to undo).
- The 10/10/10 test: how I'll feel about each option in 10 minutes, 10 months, 10 years.
- Your recommendation with confidence level, and the single piece of information that would change it.`,
  },
  {
    slug: "inbox-zero-drafter",
    title: "Inbox triage & reply drafter",
    category: "Productivity",
    description: "Clears an email backlog in one pass.",
    content: `I'm pasting a batch of emails I've been avoiding. For each one:

1. Classify: reply now (under 2 min) / needs a real answer / FYI-archive / unsubscribe-delete.
2. For "reply now": draft the reply, max 3 sentences, matching my tone (sample of my writing below).
3. For "needs a real answer": tell me the one thing I must decide before I can reply, in one line.

My tone sample: [PASTE A TYPICAL EMAIL YOU'VE WRITTEN]

The backlog:
[PASTE EMAILS]`,
  },
  {
    slug: "automation-finder",
    title: "Automation opportunity finder",
    category: "Productivity",
    description: "Finds the 20% of your week a script could do.",
    content: `I'll describe my typical work week in detail. Your job:

1. List every task that is: repetitive, rule-based, and done more than twice a week.
2. For each, classify the fix: a Claude prompt template / a script (say what language and sketch the logic) / an off-the-shelf tool (name it) / genuinely needs a human.
3. Rank by hours saved per month divided by setup effort.
4. For the #1 item, build the actual solution now — write the prompt template or the script.

My week: [DESCRIBE IN DETAIL — the boring parts especially]`,
  },
  // ---------- Creative ----------
  {
    slug: "worldbuilder",
    title: "Consistent world builder",
    category: "Creative",
    description: "Builds a fictional world that holds together under pressure.",
    content: `Let's build a fictional world from one premise: [YOUR PREMISE, e.g. "water is more valuable than gold"].

Work through consequences in order — don't skip ahead:
1. Physical/economic: what does daily life cost? Who is rich and why?
2. Political: who controls the scarce thing, and what do they fear?
3. Cultural: what do people worship, celebrate, and consider taboo because of the premise?
4. Now break it: find the internal contradiction in what we've built, and fix it.
5. Give me 3 story seeds that could ONLY happen in this world.`,
  },
  {
    slug: "naming-machine",
    title: "The naming machine",
    category: "Creative",
    description: "Names that pass the say-it-out-loud test.",
    content: `Generate names for: [PRODUCT/COMPANY/CHARACTER + one sentence of vibe].

Rules: 20 candidates in 4 batches of 5 — (a) descriptive, (b) invented-but-pronounceable, (c) real words repurposed, (d) two-word combos. For each: how it sounds said aloud on a phone call, and the obvious downside.

Then shortlist your top 3 with domain-name-style handles, and tell me which one you'd bet on and why. No names that sound like a pharmaceutical.`,
  },
  {
    slug: "constraint-jam",
    title: "Creative constraint jam",
    category: "Creative",
    description: "Break a creative block with escalating constraints.",
    content: `I'm blocked on: [DESCRIBE THE CREATIVE PROJECT AND WHERE IT'S STUCK].

Run a constraint jam:
1. Give me 3 arbitrary constraints (a length, a banned element, a required element) and make me produce a rough version in 10 minutes. Keep the constraints weird but workable.
2. When I share the result, point at the ONE unexpected thing in it worth keeping.
3. New round: 3 different constraints built around that thing.
4. After 3 rounds, help me see what the exercise revealed about what the piece wants to be.`,
  },
  {
    slug: "scene-director",
    title: "Scene director",
    category: "Creative",
    description: "Punches up flat dialogue and lifeless scenes.",
    content: `Here's a scene that isn't working: [PASTE SCENE].

As a script doctor:
1. What does each character WANT in this scene, and where does the text forget it?
2. Rewrite the scene with the same events but: everyone says at most 60% as many words, nobody says what they actually mean directly, and the setting intrudes at least once.
3. Show me the before/after of the 3 lines you changed most, with one sentence on why.`,
  },
];

export function promptsByCategory(category?: string): Prompt[] {
  if (!category || category === "All") return PROMPTS;
  return PROMPTS.filter((p) => p.category === category);
}
