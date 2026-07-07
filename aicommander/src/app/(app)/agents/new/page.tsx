import { AgentForm } from "@/components/AgentForm";

export default function NewAgentPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-2xl font-bold">Enlist an agent</h1>
      <p className="mb-8 text-sm text-muted">
        Define a specialist. You can refine the persona at any time.
      </p>
      <AgentForm />
    </div>
  );
}
