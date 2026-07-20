import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ROLES } from "@/lib/content";

const bodySchema = z.object({
  roleSlug: z.string().refine((s) => ROLES.some((r) => r.slug === s), {
    message: "Unknown role",
  }),
  name: z.string().trim().min(1).max(120),
  email: z.string().email().max(200),
  location: z.string().trim().max(120).optional().or(z.literal("")),
  links: z.string().trim().max(1000).optional().or(z.literal("")),
  pitch: z.string().trim().min(10).max(4000),
});

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid application." }, { status: 400 });
  }
  const { roleSlug, name, email, location, links, pitch } = parsed.data;
  await prisma.jobApplication.create({
    data: {
      roleSlug,
      name,
      email: email.toLowerCase(),
      location: location || null,
      links: links || null,
      pitch,
    },
  });
  return Response.json({ ok: true });
}
