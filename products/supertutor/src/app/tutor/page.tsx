import { Chat } from "@/components/Chat";

export const metadata = { title: "AI Tutor — SuperTutor" };

export default function TutorPage() {
  return (
    <div className="pt-6">
      <h1 className="text-center text-3xl font-extrabold">
        💬 Your <span className="gradient-text">AI Tutor</span>
      </h1>
      <p className="mb-4 mt-1 text-center text-ink/60">
        Pick a subject (optional) and ask anything — I&apos;ll guide you, not just
        give you answers.
      </p>
      <Chat
        mode="tutor"
        greeting={
          "Hi, I'm SuperTutor! 🦸\nTell me what you're learning and your grade level, and let's crack it together."
        }
        placeholder="Ask me anything… e.g. “help me understand fractions”"
      />
    </div>
  );
}
