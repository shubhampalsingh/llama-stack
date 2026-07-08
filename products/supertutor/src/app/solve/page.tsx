import { Chat } from "@/components/Chat";

export const metadata = { title: "Photo Solver — SuperTutor" };

export default function SolvePage() {
  return (
    <div className="pt-6">
      <h1 className="text-center text-3xl font-extrabold">
        📸 Photo <span className="gradient-text">Problem Solver</span>
      </h1>
      <p className="mb-4 mt-1 text-center text-ink/60">
        Tap 📷, snap your homework problem, and get a step-by-step walkthrough.
        You can ask follow-up questions too!
      </p>
      <Chat
        mode="solve"
        allowSubjects={false}
        greeting={
          "Send me a photo of any problem 📸\nMath, physics, chemistry, grammar — I'll break it down step by step."
        }
        placeholder="Attach a photo, or type the problem here…"
      />
    </div>
  );
}
