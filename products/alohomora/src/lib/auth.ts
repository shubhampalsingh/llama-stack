import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id && session.user) session.user.id = token.id as string;
      return session;
    },
  },
});

export function isAdmin(email?: string | null): boolean {
  if (!email) return false;
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.toLowerCase());
}

/** A user is a member once approved (memberSince set) or if they're an admin. */
export async function getMembership(userId: string, email?: string | null) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true, application: { select: { status: true } } },
  });
  const admin = isAdmin(email);
  return {
    user,
    isMember: Boolean(user?.memberSince) || admin,
    isAdmin: admin,
    applicationStatus: user?.application?.status ?? null,
  };
}
