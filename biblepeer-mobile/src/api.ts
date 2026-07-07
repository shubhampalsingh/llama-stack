import * as SecureStore from "expo-secure-store";

// Point at your deployed BiblePeer instance. For local dev against `next dev`,
// set EXPO_PUBLIC_API_URL=http://<your-mac-ip>:3000 in .env.
export const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? "https://biblepeer.com";

const TOKEN_KEY = "biblepeer-token";

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setToken(token: string | null): Promise<void> {
  if (token) await SecureStore.setItemAsync(TOKEN_KEY, token);
  else await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {}
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (options.auth !== false) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(data?.error ?? `Request failed (${res.status})`, res.status);
  }
  return data as T;
}

// ---- Types mirrored from the backend ----

export interface HomeData {
  user: { email: string; name: string | null; hasKey: boolean };
  streak: number;
  circles: {
    id: string;
    name: string;
    emoji: string;
    role: "OWNER" | "MEMBER";
    members: number;
    studies: number;
    latestStudy: { id: string; title: string; reference: string } | null;
  }[];
  plans: { id: string; name: string; emoji: string; totalDays: number; doneDays: number }[];
}

export interface CircleData {
  id: string;
  name: string;
  emoji: string;
  description: string;
  isPublic: boolean;
  inviteCode: string | null;
  isMember: boolean;
  members: string[];
  studies: {
    id: string;
    title: string;
    reference: string;
    reflections: number;
    createdAt: string;
  }[];
}

export interface StudyData {
  id: string;
  title: string;
  reference: string;
  translation: string;
  passageText: string;
  circle: { id: string; name: string; emoji: string };
  isMember: boolean;
  reflections: ReflectionData[];
}

export interface ReflectionData {
  id: string;
  content: string;
  userName: string;
  createdAt: string;
}

export interface PlanData {
  id: string;
  name: string;
  emoji: string;
  description: string;
  days: { day: number; reference: string; note?: string }[];
  doneDays: number[];
  streak: number;
}

export interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

// ---- Endpoints ----

export const api = {
  requestCode: (email: string) =>
    request<{ sent: boolean }>("/api/mobile/auth", {
      method: "POST",
      body: { email },
      auth: false,
    }),
  verifyCode: (email: string, code: string) =>
    request<{ token: string }>("/api/mobile/auth", {
      method: "POST",
      body: { email, code },
      auth: false,
    }),
  home: () => request<HomeData>("/api/mobile/home"),
  circle: (id: string) => request<CircleData>(`/api/mobile/circles/${id}`),
  study: (id: string) => request<StudyData>(`/api/mobile/studies/${id}`),
  postReflection: (studyId: string, content: string) =>
    request<ReflectionData>(`/api/mobile/studies/${studyId}`, {
      method: "POST",
      body: { content },
    }),
  join: (inviteCode: string) =>
    request<{ circleId: string; name: string; emoji: string }>("/api/mobile/join", {
      method: "POST",
      body: { inviteCode },
    }),
  plan: (planId: string) => request<PlanData>(`/api/mobile/plans/${planId}`),
  toggleDay: (planId: string, day: number) =>
    request<{ done: boolean }>(`/api/mobile/plans/${planId}`, {
      method: "POST",
      body: { day },
    }),
  companion: (messages: ChatMsg[], passage?: string, reference?: string) =>
    request<{ reply: string }>("/api/mobile/companion", {
      method: "POST",
      body: { messages, passage, reference },
    }),
  passage: (ref: string) =>
    request<{ reference: string; translation: string; text: string }>(
      `/api/mobile/passage?ref=${encodeURIComponent(ref)}`
    ),
  saveKey: (apiKey: string) =>
    request<{ configured: boolean }>("/api/mobile/key", { method: "POST", body: { apiKey } }),
  removeKey: () => request<{ configured: boolean }>("/api/mobile/key", { method: "DELETE" }),
};
