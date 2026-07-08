import Link from "next/link";

export default function Home() {
  return (
    <div className="pt-16 text-center">
      <div className="animate-flicker mx-auto mb-5 w-fit text-7xl">🕯️</div>
      <h1 className="mx-auto max-w-3xl text-5xl font-bold leading-tight sm:text-6xl">
        Every story needs <span className="gradient-text">a you</span>
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-lg text-faded">
        Play adventures where <em>anything you type can happen</em> — or write
        your own fiction with an AI co-author at your shoulder. Built for
        story-lovers of every age.
      </p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Link href="/play" className="btn px-8 py-3 text-lg">
          🎲 Start an adventure
        </Link>
        <Link href="/write" className="btn-ghost px-8 py-3 text-lg">
          ✍️ Open the studio
        </Link>
      </div>
      <p className="mt-3 text-sm text-faded/70">
        Free to play, no sign-up · Sign in with Google to save & resume your stories
      </p>

      <div className="mt-16 grid gap-5 text-left sm:grid-cols-2">
        <div className="card p-7">
          <div className="text-4xl">🎲</div>
          <h2 className="mt-3 text-2xl font-bold">Play mode</h2>
          <p className="mt-2 leading-relaxed text-faded">
            Pick a genre, plant a premise (or let fate decide), and the story
            unfolds scene by scene. Choose one of three paths — or type your
            own: <span className="story-text text-parchment">&ldquo;I befriend the dragon and open a bakery.&rdquo;</span>{" "}
            The story listens. 8–12 scenes to an ending, then a recap of the
            legend you made — share it anywhere.
          </p>
        </div>
        <div className="card p-7">
          <div className="text-4xl">✍️</div>
          <h2 className="mt-3 text-2xl font-bold">Write mode</h2>
          <p className="mt-2 leading-relaxed text-faded">
            A quiet dark-room editor for your own fiction, with a co-author on
            call: <span className="text-candle">Continue</span> the scene,{" "}
            <span className="text-candle">add a twist</span> grown from your
            own foreshadowing, <span className="text-candle">punch up dialogue</span>,{" "}
            <span className="text-candle">deepen a description</span>, or get an
            honest <span className="text-candle">critique</span>. Your voice,
            amplified — never replaced.
          </p>
        </div>
      </div>

      <div className="card mx-auto mt-14 max-w-2xl p-8">
        <h2 className="text-3xl font-bold">
          How <span className="gradient-text">play mode</span> feels
        </h2>
        <div className="story-text mt-5 text-left text-parchment/90">
          <p>
            The lighthouse door swings open before you touch it. Inside, the
            keeper&apos;s logbook lies open to a page dated tomorrow — and the
            entry is written in your handwriting…
          </p>
        </div>
        <div className="mt-5 space-y-2 text-left">
          <div className="choice">Read the rest of tomorrow&apos;s entry aloud</div>
          <div className="choice">Climb the stairs toward the cold light</div>
          <div className="choice">Tear out the page and pocket it</div>
          <div className="rounded-2xl border border-dashed border-candle/40 px-4 py-3 text-sm font-bold text-candle/80">
            ✏️ …or type literally anything else
          </div>
        </div>
      </div>
    </div>
  );
}
