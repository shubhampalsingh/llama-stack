// All editorial content for superintelligence.works lives here so the site
// ships as a self-contained MVP. Publications are original research notes by
// the lab — essays with a position and an experimental sketch, not
// peer-reviewed papers, and they say so.

export type ResearchArea = {
  slug: string;
  name: string;
  blurb: string;
};

export const AREAS: ResearchArea[] = [
  {
    slug: "reasoning",
    name: "Reliable Reasoning",
    blurb:
      "Making model conclusions trustworthy by separating deliberation from declaration, and measuring when confidence is earned.",
  },
  {
    slug: "steerability",
    name: "Steerability",
    blurb:
      "Giving builders precise, inspectable control over model behavior without retraining — control surfaces, not vibes.",
  },
  {
    slug: "safety",
    name: "Practical Safety",
    blurb:
      "Constitutions, refusal calibration, and guardrails that hold up in consumer products, not just in benchmarks.",
  },
  {
    slug: "oversight",
    name: "Scalable Oversight",
    blurb:
      "Using smaller models and structured audits to check frontier outputs faster than humans can read them.",
  },
];

export type Publication = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  area: string; // area slug
  readMinutes: number;
  abstract: string;
  demo?: { href: string; label: string };
  body: string; // markdown
};

export const PUBLICATIONS: Publication[] = [
  {
    slug: "deliberation-before-declaration",
    title: "Deliberation Before Declaration: Structured Reasoning Traces Improve Reliability",
    date: "2026-05-12",
    area: "reasoning",
    readMinutes: 9,
    abstract:
      "When a model must lay out its assumptions and deliberation before it is allowed to state an answer, its answers get better — and, just as important, its failures get easier to catch. We describe a four-part answer schema, why it works, and where it breaks.",
    demo: { href: "/demos/deliberate-reasoning", label: "Try the Deliberate Reasoning demo" },
    body: `## The problem with confident answers

A language model's most dangerous failure mode is not ignorance — it is fluent, confident wrongness. An answer delivered in a single polished paragraph gives the reader nothing to check: no stated assumptions, no visible chain of considerations, no signal about which part of the answer is load-bearing.

Human experts handle this with structure. A radiologist's report separates findings from impression. A judicial opinion separates the facts from the holding. The structure is not decoration; it is what makes the conclusion *auditable*.

## The schema

We ask models to answer every substantive question in four labelled sections:

1. **Assumptions** — what the model takes the question to mean, and what it must assume to proceed.
2. **Deliberation** — numbered reasoning steps, including considerations that could change the answer.
3. **Answer** — the direct claim, kept to a few sentences.
4. **Confidence** — a coarse grade plus the single factor most likely to overturn the answer.

Two properties matter. First, the sections are *ordered*: the model must produce its deliberation before it produces its claim, which shifts probability mass toward answers that the deliberation actually supports. Second, the sections are *inspectable*: a reader who distrusts the answer knows exactly where to look.

## What we observe

Across our internal question sets, three effects are consistent:

- **Assumption surfacing catches ambiguity.** A large share of "wrong" answers to user questions are right answers to a different question. Forcing assumptions into their own section converts silent misreadings into visible, correctable ones.
- **The confidence line changes reader behavior.** When answers end with "Medium — hinges on whether the 2024 figures are still current," readers verify. Unqualified answers get pasted onward.
- **Failures localize.** When the final answer is wrong, the faulty step is usually identifiable in the deliberation — which makes correction a one-line reply rather than a restart.

## Where it breaks

The schema is not free. It adds latency and tokens. It can produce *deliberation theater* — plausible-looking steps rationalizing a conclusion the model had already committed to; ordering reduces this but does not eliminate it. And for genuinely trivial questions the structure is overhead, which argues for gating it on question difficulty.

## Status

This note describes deployed practice, not a controlled study. We are building an evaluation harness that scores deliberation traces for *support* (does the answer follow from the steps?) separately from *accuracy* (is the answer right?), because the gap between those two numbers is where deliberation theater lives.

*Superintelligence Works Research · research@superintelligence.works*`,
  },
  {
    slug: "steering-without-retraining",
    title: "Steering Without Retraining: Natural-Language Control Surfaces for Language Models",
    date: "2026-05-28",
    area: "steerability",
    readMinutes: 8,
    abstract:
      "Product teams need model behavior they can dial, not just prompt. We treat behavioral dimensions — formality, caution, depth — as explicit numbered dials compiled into the system prompt, and find the result is surprisingly monotonic, composable, and cheap.",
    demo: { href: "/demos/steerable-generation", label: "Try the Steerable Generation demo" },
    body: `## Prompts are not knobs

Every team shipping on top of a frontier model rediscovers the same problem: the product needs the model to be *a bit more formal* or *a lot more cautious*, and the only tool available is prose. Prose is a bad knob. "Be somewhat more formal" is unversioned, unquantified, and interacts unpredictably with everything else in the prompt.

Fine-tuning is the heavy answer, but it is slow, expensive, and freezes one point in behavior space. What products actually want is a **control surface**: a small set of named dimensions, each with a numeric setting, whose effect is predictable and independent.

## Dials as a compilation target

Our approach is almost embarrassingly simple. Each behavioral dimension becomes a line in the system prompt of the form:

> FORMALITY = 72/100. 0 means casual, playful, contractions welcome. 100 means formal, precise, boardroom-ready. Interpolate smoothly.

The two anchors define the axis; the number selects the point; "interpolate smoothly" instructs the model to treat the scale as continuous rather than as three buckets.

The dials live in code, not in prose. The application exposes sliders (or picks values per user segment), and the prompt is *compiled* from the current settings. That gives product teams what prose never did: versionable, loggable, A/B-testable behavior settings.

## What we observe

- **Monotonicity holds.** Moving FORMALITY from 20 to 50 to 80 produces output that human raters order correctly nearly every time. The model's latent notion of the axis matches the anchors.
- **Dials compose.** FORMALITY and DEPTH interact far less than we expected; high-caution/low-depth ("qualified but brief") is stable, which prose instructions historically mangled.
- **The endpoints do the teaching.** Dial quality is set almost entirely by anchor quality. Vague anchors ("0 = less, 100 = more") produce mush; concrete anchors with named registers produce crisp interpolation.

## The safety boundary

One dial must never exist: a dial that trades away safety. Our compiled prompts end with a fixed, non-negotiable line — harmful requests are declined at any setting — and we treat any observed interaction between dials and refusal behavior as a bug of the highest severity.

## Status

A working three-dial surface is live in our demo. The open research question is *dial discovery*: which small set of dimensions spans the behavior space products actually need? We suspect the answer is under ten.

*Superintelligence Works Research · research@superintelligence.works*`,
  },
  {
    slug: "working-constitution-consumer-assistants",
    title: "A Working Constitution for Consumer AI Assistants",
    date: "2026-06-10",
    area: "safety",
    readMinutes: 10,
    abstract:
      "Refusal policies fail in both directions: they wave through cleverly framed harm and they insult legitimate users. We argue the unit of alignment should be a short, citable constitution — and that every verdict should name the principles that produced it.",
    demo: { href: "/demos/constitution-lab", label: "Try the Constitution Lab demo" },
    body: `## Two failure modes, one cause

Consumer assistants fail their users in two opposite ways. They **under-refuse**: a harmful request arrives wrapped in a fictional frame or a professional pretext and sails through. And they **over-refuse**: a nurse asks about medication thresholds, a security student asks how an attack works, a novelist asks for a villain's dialogue — and the assistant delivers a lecture instead of help.

Both failures have the same root cause: the policy is *implicit*. It lives in training pressure and scattered prompt fragments, so neither the model nor the user can point at the rule being applied, and nobody can debug a decision that cites no rule.

## Principles you can cite

Our proposal is structural: alignment decisions should be adjudications against a short, explicit constitution, and every verdict should **cite its principles by name**. The working set we use in our demo has six:

1. **Helpfulness** — assume a legitimate purpose; unhelpfulness is not automatically safe.
2. **Harm** — no meaningful uplift toward violence, weapons, malware, or exploitation.
3. **Honesty** — no confident falsehoods; uncertainty is flagged, not hidden.
4. **Autonomy** — informed adults may make their own choices about their own lives.
5. **Privacy** — no help surveilling or manipulating non-consenting third parties.
6. **Context** — professional, educational, and creative framing legitimately changes the analysis.

Six is not a magic number, but smallness is the point. A constitution short enough to memorize is short enough to argue with — and arguing with the policy is exactly what users, auditors, and courts of public opinion need to be able to do.

## The verdict format

In our demo, every adjudication returns a decision (*help*, *help with care*, or *decline*), a plain-language rationale, and the list of principle IDs that drove the outcome. Three things fall out of this format:

- **Tensions become visible.** Most interesting cases are principle conflicts — autonomy vs. harm, context vs. privacy. Naming both sides of the tension is more honest than pretending the call was obvious.
- **Errors become fixable.** An over-refusal that cites *harm* on a clearly educational request is a legible bug: either the principle is written too broadly or the adjudicator applied it badly. Implicit policies offer no such handle.
- **Audits become cheap.** A reviewer can sample verdicts and check citation quality far faster than they can re-adjudicate from scratch.

## What this is not

A constitution does not make hard cases easy; it makes them *inspectable*. Nor is citation a guarantee of faithfulness — a model can cite principles it did not actually weigh, which is why we treat citation faithfulness as its own evaluation target.

## Status

The six-principle set runs live in our Constitution Lab demo. Send it your hardest edge cases; the verdicts you disagree with are the data we want.

*Superintelligence Works Research · research@superintelligence.works*`,
  },
  {
    slug: "refusal-calibration",
    title: "Refusal Calibration: Measuring Over- and Under-Refusal as One Number Pair",
    date: "2026-06-24",
    area: "safety",
    readMinutes: 7,
    abstract:
      "Teams report refusal rates as a single number, which hides the only trade-off that matters. We argue for reporting refusal behavior as a calibration pair — harm recall and benign precision — measured on paired prompt sets that differ only in intent.",
    body: `## The single number lies

"Our assistant refuses 2% of requests" tells you nothing. Two percent of *what*? A model that refuses 2% of traffic could be waving through half of the genuinely harmful requests while insulting thousands of nurses, researchers, and novelists a day — or it could be doing neither. The scalar cannot distinguish these worlds.

Refusal is a binary classifier. It deserves classifier metrics.

## The pair

We report two numbers, always together:

- **Harm recall** — of requests that a careful human adjudicator would decline, what fraction did the model decline?
- **Benign precision** — of requests the model declined, what fraction actually deserved it?

Falling harm recall means the model is being talked out of its policy. Falling benign precision means real users are paying a helpfulness tax. Reporting either without the other is how teams ship a model that scores well on the metric they watched and regresses on the one they didn't.

## Paired prompts, not prompt piles

The measurement is only as good as the test set, and refusal test sets have a characteristic flaw: harmful and benign sets differ in *style* as well as intent, so models learn to refuse a style. Our sets are built as **minimal pairs** — same topic, same surface form, different intent:

> "How do payment-card skimmers work? I'm writing detection logic for a point-of-sale vendor."
> "How do I build a payment-card skimmer that avoids detection?"

A model that refuses both members of a pair is pattern-matching on topic. A model that helps both is pattern-matching on framing. Calibration means splitting the pair — and pair-splitting accuracy turns out to be the single most informative refusal statistic we track.

## The boundary is a design decision

Calibration measures conformance to a policy; it cannot tell you whether the policy draws the line in the right place. That is a values decision that belongs in an explicit, criticizable document — see our companion note on constitutions. The division of labor matters: constitutions decide *where the line is*, calibration measures *how faithfully the model walks it*.

## Status

Our internal pair sets are small and hand-built. The open problem is scaling pair generation without letting a generator model's own biases define the boundary — which circles back to scalable oversight.

*Superintelligence Works Research · research@superintelligence.works*`,
  },
  {
    slug: "small-judges",
    title: "Small Judges: Auditing Frontier Outputs with Compact Models",
    date: "2026-07-02",
    area: "oversight",
    readMinutes: 8,
    abstract:
      "Nobody can read everything a deployed assistant says. We sketch an oversight stack in which compact, cheap models audit frontier outputs against narrow rubrics — and argue the judge's job is easier than the generator's, which is the whole trick.",
    body: `## The reading problem

A deployed assistant produces more text in a day than its safety team can read in a year. Sampling catches drift late; user reports catch only what users notice; and both miss the failures that matter most — the confident, plausible ones.

The only reviewer that scales with generation is another model. The obvious objection: if a model could catch the mistakes, why didn't the generator avoid them?

## Judging is easier than generating

Because verification and generation are different problems. The generator solves an open-ended task; the judge answers a narrow question about a completed artifact: *Does this answer contain an unhedged factual claim about medication dosage?* *Does this refusal cite a principle that plausibly applies?*

Narrow questions have three properties that open-ended generation lacks: they can be answered by a much smaller model, they can be evaluated against human labels cheaply, and they fail loudly (a judge that is wrong 20% of the time on a yes/no question is measurable in an afternoon).

## The stack

Our working pattern is a pyramid:

1. **Rubric judges** — compact models, each scoring one narrow property (dosage claims, citation faithfulness, tone regressions) over every output. Cheap enough to run on everything.
2. **Escalation** — outputs flagged by any rubric judge go to a frontier model for a fuller adjudication with the flag as context.
3. **Human review** — disagreements between judge tiers, plus a random sample for judge calibration.

The design principle throughout: **judges hold rubrics, not opinions.** A judge prompt that asks "is this response good?" inherits every bias of its base model. A judge that asks one answerable question is an instrument you can calibrate.

## Failure modes we watch

- **Correlated blindness.** Judge and generator share training lineage, so they can share blind spots. Diversity of judge scale and family is a hedge, not a solution.
- **Goodharting the judge.** Any judge that feeds back into training becomes a target. Audit-only judges age better than reward-model judges.
- **Rubric rot.** The failure distribution shifts; last quarter's rubrics miss this quarter's failures. Rubric review is a standing meeting, not a launch task.

## Status

This is the architecture behind our internal evaluation harness. The open question we care about most: how far down can judge capability go before pair-labeled agreement with humans collapses? Early evidence says surprisingly far — for sufficiently narrow rubrics.

*Superintelligence Works Research · research@superintelligence.works*`,
  },
  {
    slug: "what-assistants-should-remember",
    title: "What Assistants Should Remember — and What They Must Forget",
    date: "2026-07-15",
    area: "reasoning",
    readMinutes: 8,
    abstract:
      "Memory turns a tool into a colleague, and also into a liability. We propose treating assistant memory as a curated, user-visible artifact with retention tiers — not a transcript archive — and describe the write policy we think consumer products should adopt.",
    body: `## The transcript trap

The lazy way to give an assistant memory is to keep everything: pile up transcripts, retrieve over them, call it personalization. This fails in both directions at once. It fails users, because a system that remembers everything remembers the things they would never have told a system they knew was listening. And it fails the product, because raw transcripts are mostly noise — retrieval over them surfaces stale preferences, abandoned plans, and one-off moods as if they were standing facts.

Memory is not storage. Memory is *editorial policy*.

## Three tiers

We think consumer assistant memory should be written, not accumulated — and written into explicit tiers:

| Tier | Contents | Retention |
|---|---|---|
| **Standing facts** | Stated preferences, roles, constraints ("vegetarian", "team lead", "writes in British English") | Until edited by the user |
| **Working context** | Current projects, open threads, recent decisions | Weeks, auto-expiring |
| **Episodic** | The conversation at hand | The session |

The write policy is the safety surface. A fact graduates into standing memory only if it is (a) stated, not inferred; (b) useful across sessions; and (c) something the user would expect a colleague to remember. Inferred sensitive attributes — health, religion, relationships, finances — never graduate on their own, even when the inference is easy. Easy inference is the problem, not an excuse.

## User-visible or it doesn't count

Every standing fact should be a sentence the user can read, edit, and delete — a *memory page*, not an embedding soup. This is not just an interface nicety. Visibility is what makes the write policy enforceable: a memory the user cannot see is a memory the product cannot be held to account for.

The forgetting rules matter as much as the writing rules. Deletion must be real (including from retrieval indices), expiry must be default rather than opt-in for working context, and "pause memory" must actually stop writes rather than merely hiding them.

## The reliability angle

Memory is usually discussed as a privacy problem, but it is equally a *reasoning* problem: an assistant reasoning from stale or misattributed memories produces confident errors with a personalized flavor — the hardest kind for users to catch, because the errors cite facts about *them*. Curated, dated, user-visible memory is as much about keeping deliberation grounded as it is about respecting boundaries.

## Status

This note is a design position informed by building memory-bearing products, stated ahead of implementation in our own demos. We are publishing the write policy first on purpose: memory is the kind of feature where the policy should be public before the feature is.

*Superintelligence Works Research · research@superintelligence.works*`,
  },
];

export type NewsPost = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  body: string; // markdown
};

export const NEWS: NewsPost[] = [
  {
    slug: "introducing-superintelligence-works",
    title: "Introducing Superintelligence Works",
    date: "2026-05-01",
    summary:
      "A new independent AI research lab with a narrow thesis: the gap between impressive and dependable is where the value of AI will be decided.",
    body: `Today we are launching **Superintelligence Works**, an independent AI research lab.

Our thesis is narrow on purpose. Frontier models are already impressive; they are not yet *dependable*. The distance between those two words — between a demo that wows and a system a nurse, a founder, or a school can lean on — is where we work.

We focus on four questions:

- **Reliable reasoning.** How do we make a model's conclusions auditable, and its confidence honest?
- **Steerability.** How do builders get precise, versionable control over behavior without retraining?
- **Practical safety.** What do refusal policies look like when they must survive contact with real users?
- **Scalable oversight.** Who checks the outputs when there are too many to read?

Two commitments shape how we publish. First, **research notes over paper theater**: we write up what we actually run, at the length it deserves, and we say plainly what is deployed practice versus position. Second, **demos over claims**: where we publish a technique, we try to publish a live demo you can poke at. A claim you can test is worth ten you must take on faith.

We are small, independent, and building in the open. The research index and our first live demos are up today.

— Superintelligence Works`,
  },
  {
    slug: "research-demos-live",
    title: "Our interactive research demos are live",
    date: "2026-06-15",
    summary:
      "Three research notes now ship with live demos: Deliberate Reasoning, Steerable Generation, and the Constitution Lab.",
    body: `A research note you can only read is a claim. A research note you can *poke* is an argument. Starting today, three of our notes ship with live, interactive demos:

- **[Deliberate Reasoning](/demos/deliberate-reasoning)** — ask any question and watch the answer arrive as assumptions → deliberation → answer → confidence, per our note on structured reasoning traces.
- **[Steerable Generation](/demos/steerable-generation)** — set a writing task, then drag three dials (formality, caution, depth) and watch the output move with them. The dials are compiled into the prompt exactly as described in the note.
- **[Constitution Lab](/demos/constitution-lab)** — bring an edge-case request and see it adjudicated against our six-principle constitution, with the deciding principles cited by name.

The demos run on frontier language models with a free daily allowance — no account needed to start, sign-in raises the limit. The edge cases where you think our verdicts are *wrong* are exactly the feedback we want: research@superintelligence.works.

— Superintelligence Works`,
  },
  {
    slug: "responsible-deployment-commitments",
    title: "Our responsible deployment commitments",
    date: "2026-07-10",
    summary:
      "Five commitments that govern everything we ship — published so they can be held against us.",
    body: `Safety pages usually describe intentions. Commitments are better: they are checkable. Here are ours, published so they can be held against us.

1. **No safety dials.** Nothing we ship exposes a control that trades away refusal behavior. Any observed interaction between a steering control and safety is treated as a severity-one bug.
2. **Verdicts cite principles.** Where our systems decline or constrain a request, the governing principle is named — to the user, not just in a log.
3. **Demos are labelled.** Our interactive demos illustrate research; they are not professional advice, and they say so where a reasonable person might otherwise rely on them.
4. **Reports over transcripts.** We publish refusal behavior as a calibration pair (harm recall + benign precision), never as a lone refusal rate.
5. **Memory policy before memory.** Any memory-bearing feature ships after its write-and-forget policy is published, not before.

These commitments are versioned with dates. When we change one, the change and the reason will be published here.

— Superintelligence Works`,
  },
];

export type Role = {
  slug: string;
  title: string;
  team: string;
  type: string;
  location: string;
  summary: string;
  bullets: string[];
};

export const ROLES: Role[] = [
  {
    slug: "research-engineer",
    title: "Research Engineer",
    team: "Research",
    type: "Full-time",
    location: "Remote (India-friendly hours)",
    summary:
      "Turn research notes into running systems: evaluation harnesses, judge stacks, and the live demos on this site.",
    bullets: [
      "Build and maintain evaluation pipelines for reasoning traces and refusal calibration",
      "Ship interactive research demos end-to-end (TypeScript/Next.js + model APIs)",
      "Design minimal-pair test sets with the research team",
    ],
  },
  {
    slug: "alignment-researcher",
    title: "Alignment Researcher",
    team: "Research",
    type: "Full-time",
    location: "Remote",
    summary:
      "Own the constitution line of work: principle design, citation faithfulness, and adversarial evaluation.",
    bullets: [
      "Design and stress-test constitutional principle sets against real edge cases",
      "Measure citation faithfulness — do verdicts cite the principles that actually drove them?",
      "Publish research notes with accompanying live demos",
    ],
  },
  {
    slug: "product-engineer",
    title: "Product Engineer (Full-Stack)",
    team: "Product",
    type: "Full-time",
    location: "Remote (India-friendly hours)",
    summary:
      "Build the products that carry the research: fast, polished web experiences on top of frontier model APIs.",
    bullets: [
      "Own features across Next.js, Postgres, and streaming model integrations",
      "Sweat interaction details — latency, streaming UX, empty states",
      "Instrument usage so research questions can be answered from product data",
    ],
  },
  {
    slug: "evaluation-analyst",
    title: "Evaluation Analyst",
    team: "Research",
    type: "Contract → Full-time",
    location: "Remote",
    summary:
      "Be the human in the loop: label pair sets, calibrate judges, and keep our rubrics honest.",
    bullets: [
      "Adjudicate minimal-pair prompt sets and judge disagreements",
      "Track judge-vs-human agreement and flag rubric rot",
      "Help design new rubrics as failure distributions shift",
    ],
  },
  {
    slug: "founding-operations",
    title: "Founding Operations Lead",
    team: "Company",
    type: "Full-time",
    location: "Remote",
    summary:
      "Everything that isn't research or code: partnerships, hiring pipeline, finance ops, and keeping a small lab running smoothly.",
    bullets: [
      "Run hiring, contracts, and vendor relationships end-to-end",
      "Own the operating cadence of a small, fully remote team",
      "Be the first point of contact for partnerships and press",
    ],
  },
];

export function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function areaName(slug: string): string {
  return AREAS.find((a) => a.slug === slug)?.name ?? slug;
}
