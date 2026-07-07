"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { StatusBadge } from "@/components/StatusBadge";

interface AgentInfo {
  id: string;
  name: string;
  emoji: string;
  model: string;
}

export interface TaskData {
  id: string;
  status: string;
  instruction: string;
  result: string | null;
  transcript: unknown;
  inputTokens: number;
  outputTokens: number;
  agent: AgentInfo;
}

type FeedItem =
  | { kind: "status"; text: string }
  | { kind: "search"; text: string }
  | { kind: "thinking"; text: string };

interface LiveState {
  status: string;
  feed: FeedItem[];
  text: string;
  error: string | null;
  usage: { inputTokens: number; outputTokens: number } | null;
}

function initialLive(task: TaskData): LiveState {
  return {
    status: task.status,
    feed: [],
    text: task.result ?? "",
    error: null,
    usage:
      task.inputTokens || task.outputTokens
        ? { inputTokens: task.inputTokens, outputTokens: task.outputTokens }
        : null,
  };
}

export function MissionControl({
  missionId,
  tasks,
  autostart,
}: {
  missionId: string;
  tasks: TaskData[];
  autostart: boolean;
}) {
  const [live, setLive] = useState<Record<string, LiveState>>(() =>
    Object.fromEntries(tasks.map((t) => [t.id, initialLive(t)]))
  );
  const startedRef = useRef(false);

  const patch = useCallback((taskId: string, fn: (s: LiveState) => LiveState) => {
    setLive((prev) => ({ ...prev, [taskId]: fn(prev[taskId]) }));
  }, []);

  const runTask = useCallback(
    async (taskId: string) => {
      patch(taskId, (s) => ({ ...s, status: "RUNNING", feed: [], text: "", error: null }));

      try {
        const res = await fetch(`/api/missions/${missionId}/tasks/${taskId}/run`, {
          method: "POST",
        });
        if (!res.ok || !res.body) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.error ?? `Run failed (${res.status})`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const frames = buffer.split("\n\n");
          buffer = frames.pop() ?? "";

          for (const frame of frames) {
            const line = frame.split("\n").find((l) => l.startsWith("data: "));
            if (!line) continue;
            let event;
            try {
              event = JSON.parse(line.slice(6));
            } catch {
              continue;
            }

            patch(taskId, (s) => {
              switch (event.type) {
                case "status":
                  return { ...s, feed: [...s.feed, { kind: "status", text: event.message }] };
                case "web_search":
                  return {
                    ...s,
                    feed: [...s.feed, { kind: "search", text: `Searching: “${event.query}”` }],
                  };
                case "web_search_results":
                  return {
                    ...s,
                    feed: [...s.feed, { kind: "search", text: `↳ ${event.count} results` }],
                  };
                case "thinking": {
                  const feed = [...s.feed];
                  const last = feed[feed.length - 1];
                  if (last?.kind === "thinking") {
                    feed[feed.length - 1] = { kind: "thinking", text: last.text + event.text };
                  } else {
                    feed.push({ kind: "thinking", text: event.text });
                  }
                  return { ...s, feed };
                }
                case "text":
                  return { ...s, text: s.text + event.text };
                case "usage":
                  return {
                    ...s,
                    usage: { inputTokens: event.inputTokens, outputTokens: event.outputTokens },
                  };
                case "done":
                  return { ...s, status: "COMPLETED" };
                case "error":
                  return { ...s, status: "FAILED", error: event.message };
                default:
                  return s;
              }
            });
          }
        }
      } catch (e) {
        patch(taskId, (s) => ({
          ...s,
          status: "FAILED",
          error: e instanceof Error ? e.message : "Connection lost",
        }));
      }
    },
    [missionId, patch]
  );

  const runAll = useCallback(() => {
    for (const t of tasks) {
      const state = live[t.id];
      if (state.status !== "RUNNING") void runTask(t.id);
    }
  }, [tasks, live, runTask]);

  useEffect(() => {
    if (autostart && !startedRef.current) {
      startedRef.current = true;
      for (const t of tasks) {
        if (t.status === "PENDING") void runTask(t.id);
      }
    }
  }, [autostart, tasks, runTask]);

  const anyRunnable = tasks.some((t) => live[t.id]?.status !== "RUNNING");

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={runAll}
          disabled={!anyRunnable}
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-black transition hover:bg-accent-dim disabled:cursor-not-allowed disabled:opacity-40"
        >
          🚀 Run all agents
        </button>
      </div>

      {tasks.map((task) => {
        const s = live[task.id];
        return (
          <div key={task.id} className="overflow-hidden rounded-xl border border-border-dim bg-surface">
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-border-dim px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">{task.agent.emoji}</span>
                <div>
                  <p className="text-sm font-semibold">{task.agent.name}</p>
                  <p className="font-mono text-[10px] text-muted">{task.agent.model}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {s.usage && (
                  <span className="font-mono text-[10px] text-muted">
                    {s.usage.inputTokens.toLocaleString()} in ·{" "}
                    {s.usage.outputTokens.toLocaleString()} out
                  </span>
                )}
                <StatusBadge status={s.status} />
                {s.status !== "RUNNING" && (
                  <button
                    onClick={() => runTask(task.id)}
                    className="rounded-md border border-border-dim px-3 py-1 text-xs transition hover:border-accent hover:text-accent"
                  >
                    {s.status === "PENDING" ? "▶ Run" : "↻ Re-run"}
                  </button>
                )}
              </div>
            </div>

            {/* Activity feed */}
            {s.feed.length > 0 && (
              <div className="max-h-40 space-y-1 overflow-y-auto border-b border-border-dim bg-background/60 px-4 py-3 font-mono text-xs">
                {s.feed.map((item, i) => (
                  <p
                    key={i}
                    className={
                      item.kind === "search"
                        ? "text-info"
                        : item.kind === "thinking"
                          ? "italic text-muted"
                          : "text-accent"
                    }
                  >
                    {item.kind === "search" ? "🔍 " : item.kind === "thinking" ? "🧠 " : "» "}
                    {item.text}
                  </p>
                ))}
              </div>
            )}

            {/* Output */}
            <div className="px-5 py-4">
              {s.error ? (
                <p className="rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
                  {s.error}
                </p>
              ) : s.text ? (
                <div className="md-output text-sm">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{s.text}</ReactMarkdown>
                  {s.status === "RUNNING" && (
                    <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-accent align-text-bottom" />
                  )}
                </div>
              ) : s.status === "RUNNING" ? (
                <p className="animate-pulse font-mono text-sm text-muted">
                  Agent working<span className="text-accent">…</span>
                </p>
              ) : (
                <p className="text-sm text-muted">
                  Awaiting deployment. Brief: <span className="italic">{task.instruction.slice(0, 160)}{task.instruction.length > 160 ? "…" : ""}</span>
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
