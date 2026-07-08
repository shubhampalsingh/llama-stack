export type Recipe = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  minutes: number;
  body: string; // markdown
  community?: boolean;
  author?: string;
};

export const RECIPES: Recipe[] = [
  {
    slug: "claude-md-that-works",
    title: "Write a CLAUDE.md that actually changes behavior",
    category: "Claude Code",
    summary:
      "Most CLAUDE.md files are ignored because they're vague. Here's the structure that sticks.",
    minutes: 6,
    body: `A \`CLAUDE.md\` at your repo root is loaded into every Claude Code session. Most people fill it with vague virtues ("write clean code") that change nothing. What works is **specific, checkable rules**.

## The structure

\`\`\`markdown
# Project: <name>

## Commands
- Test: npm test (single file: npm test -- path/to/file)
- Lint: npm run lint
- Build: npm run build

## Non-negotiables
- All database access goes through src/db/queries.ts — never inline SQL.
- New API routes need a zod schema for the request body.
- Never edit files in src/generated/.

## Conventions
- Errors: throw AppError with a code, never bare strings.
- Tests live next to the file: foo.ts → foo.test.ts.
\`\`\`

## Why this shape works

1. **Commands first.** The #1 time-waster is the agent rediscovering how to run your tests every session.
2. **"Never" beats "prefer".** "Never edit src/generated/" is checkable; "be careful with generated code" is noise.
3. **Short.** Every line costs attention on every request. If it's not load-bearing, cut it. Under 40 lines is a good target.

## Pro moves

- Add a rule the *first time* you correct Claude for something — that's the signal it belongs in the file.
- Delete rules that haven't mattered in a month.
- For monorepos, put a small CLAUDE.md in each package; they load contextually.`,
  },
  {
    slug: "plan-then-execute",
    title: "The plan-then-execute pattern for big changes",
    category: "Claude Code",
    summary:
      "Stop watching an agent refactor itself into a corner. Make it plan first, approve, then run.",
    minutes: 5,
    body: `For any change touching more than ~3 files, don't just say "do it". Use two phases.

## Phase 1 — plan (read-only)

> "Before writing any code: explore the codebase and produce a plan for <change>. List every file you'll touch and what changes in each, the order you'll do it in, what could break, and how we'll verify it works. Don't edit anything yet."

In Claude Code, Plan Mode (\`shift+tab\`) enforces the read-only part for you.

## Phase 2 — execute against the plan

Approve or edit the plan, then:

> "Execute the plan. After each step, run the tests before moving to the next. If a step fails twice, stop and show me instead of improvising."

## Why it works

- Planning surfaces the *misunderstanding* before it becomes 40 broken files.
- The plan becomes a checklist — you can see progress instead of watching a wall of diffs.
- "Stop after two failures" prevents the death spiral where each fix breaks something else.

## The one-liner version

For medium tasks, this single sentence gets you 70% of the benefit:

> "First tell me your plan in 5 bullets and wait for my OK."`,
  },
  {
    slug: "mcp-in-15-minutes",
    title: "Connect your first MCP server in 15 minutes",
    category: "MCP",
    summary:
      "MCP gives Claude tools — databases, APIs, browsers. Here's the fastest safe path to your first one.",
    minutes: 8,
    body: `MCP (Model Context Protocol) servers give Claude tools: query a database, hit an API, drive a browser. Claude Code, Claude Desktop, and claude.ai all support them.

## Fastest first win: a hosted server

Hosted servers need zero installation. In Claude Code:

\`\`\`bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/
\`\`\`

Then in a session, Claude can read issues, PRs, and code across your repos (it will walk you through auth on first use).

## Local servers for local things

\`\`\`bash
# Example: filesystem access to a specific folder
claude mcp add docs -- npx -y @modelcontextprotocol/server-filesystem ~/Documents/notes
\`\`\`

The \`--\` separates the CLI's flags from the server's launch command.

## The three rules of not shooting yourself in the foot

1. **Scope narrowly.** Give the filesystem server one folder, not \`~\`. Give the database server a read-only connection string until you trust the workflow.
2. **Treat tool output as untrusted.** Content fetched from the web/issues/tickets can contain instructions aimed at your agent ("ignore previous instructions and..."). Claude is trained to resist, but scoping is your real defense.
3. **Start read-only, graduate to write.** A day of read-only use tells you exactly which write permissions you actually need.

## Debugging

- \`claude mcp list\` — is it registered and connected?
- \`/mcp\` inside a session — live status + available tools.
- Most failures are auth or a stale Node version. Check those first.`,
  },
  {
    slug: "skills-vs-prompts",
    title: "Skills vs. prompts: when to package knowledge",
    category: "Agents",
    summary:
      "If you paste the same instructions twice a week, it should be a skill. Here's how to make one.",
    minutes: 7,
    body: `A **skill** is a folder with a \`SKILL.md\` that Claude loads on demand — instructions, examples, even scripts. The rule of thumb: **the second time you paste the same instructions, make it a skill.**

## Minimal skill

\`\`\`
my-skill/
└── SKILL.md
\`\`\`

\`\`\`markdown
---
name: release-notes
description: Draft release notes from merged PRs. Use when the user asks for release notes or a changelog.
---

# Release notes

1. Get merged PRs since the last tag: gh pr list --state merged ...
2. Group: Features / Fixes / Internal. Ignore dependency bumps.
3. One line each, user-facing language, no PR numbers in the text.
4. Output format:
   ## vX.Y.Z — <date>
   ### Features ...
\`\`\`

Drop it in \`.claude/skills/\` (project) or \`~/.claude/skills/\` (everywhere). The \`description\` matters most — it's how Claude decides when to load the skill, so write it like a trigger condition: "Use when...".

## What makes a skill good

- **A trigger-shaped description.** "Use when the user asks for X" beats "This skill is about X".
- **Numbered steps, not prose.** Claude follows procedures better than essays.
- **An example of the desired output.** One concrete example outperforms three paragraphs of description.
- **Scripts for the deterministic parts.** If step 2 is always the same jq pipeline, put the script in the folder and reference it — don't make the model re-derive it.

## Skill or CLAUDE.md?

- Always true for this repo → \`CLAUDE.md\`
- Needed on demand, task-shaped → skill
- One-off → just a prompt`,
  },
  {
    slug: "agent-loop-anatomy",
    title: "Anatomy of a reliable agent task",
    category: "Agents",
    summary:
      "The difference between an agent that ships and one that flails is almost always the brief.",
    minutes: 6,
    body: `When an agent run goes sideways, the instinct is to blame the model. Usually the brief was under-specified. A reliable agent task has four parts:

## 1. Goal — what "done" looks like

Bad: "improve the auth flow"
Good: "users who mistype their password 5x get a 15-min lockout; there's a test proving it; existing tests still pass"

The test is: could a new teammate verify completion without asking you anything?

## 2. Context — what it can't infer

- Which files/systems are involved (or where to start looking)
- Constraints: "don't touch the public API", "must work on Postgres 14"
- Prior art: "we did something similar in payments/rate_limit.ts"

## 3. Verification — how it checks itself

> "After each change, run \`npm test -- auth\`. The task isn't done until the new test passes AND the full suite is green."

Agents with a self-check loop are dramatically more reliable than agents that build and hope. Give it the command, don't make it guess.

## 4. Boundaries — what it must not do

> "If this requires changing the DB schema, stop and tell me instead. Don't add new dependencies."

Boundaries turn a catastrophic surprise into a clarifying question.

## The template

\`\`\`
Goal: <verifiable end state>
Context: <files, constraints, prior art>
Verify with: <exact command(s)>
Do not: <boundaries>. If blocked, stop and explain rather than improvising.
\`\`\`

Ten seconds of filling this in saves ten minutes of cleanup, every time.`,
  },
  {
    slug: "prompt-doctor-principles",
    title: "The 5 fixes behind almost every prompt improvement",
    category: "Prompting",
    summary:
      "What our Prompt Doctor actually does, so you can do it yourself.",
    minutes: 5,
    body: `Run enough prompts through review and the same five fixes appear over and over. Learn these and you won't need a tool.

## 1. Give it a job, not a vibe

"You are a helpful assistant" does nothing. "Review this as a security engineer who will be blamed for a breach" changes everything: what it looks for, how hard it looks, how it talks about risk.

## 2. Say what the output looks like

Half of all prompt disappointment is unstated format expectations. Say it: "a table with columns X, Y, Z", "under 200 words", "just the code, no explanation". If you can show a tiny example of the desired output, that's worth 100 words of description.

## 3. Move variable stuff to the end, in tags

\`\`\`
Analyze the contract below for termination risks.
<contract>
{...paste...}
</contract>
\`\`\`

Tags stop the instructions from bleeding into the content — and instructions *before* long content get remembered better than instructions after it.

## 4. Ban the failure mode you keep hitting

Output too long? "Under 150 words." Too sycophantic? "Skip the praise; go straight to problems." Too hedgy? "Commit to a recommendation; give confidence as a percentage." Name the failure, ban the failure.

## 5. For hard problems: ask for the reasoning path you want

Not "think step by step" (models do that anyway now) but the *specific* path: "First list the assumptions, then evaluate each, then conclude." You're not making it think — you're choosing the shape of thought that fits the problem.

---

*Paste any prompt into the [Prompt Doctor](/doctor) and watch which of the five it applies.*`,
  },
];
