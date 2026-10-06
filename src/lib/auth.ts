import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma";

const hasGoogle = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    ...(hasGoogle
      ? [Google({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          allowDangerousEmailAccountLinking: true,
          authorization: {
            params: {
              prompt: "select_account",
            },
          },
        })]
      : []),
    Credentials({
      id: "otp",
      name: "Email OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const otp = credentials?.otp as string;

        if (!email || !otp) return null;

        // In stub mode, accept any 6-digit OTP
        if (!process.env.RESEND_API_KEY) {
          if (otp.length === 6 && /^\d+$/.test(otp)) {
            let user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
              user = await prisma.user.create({
                data: { email, emailVerified: new Date() },
              });
            }
            return { id: user.id, email: user.email, name: user.name };
          }
          return null;
        }

        // With Resend: verify OTP against VerificationToken
        const token = await prisma.verificationToken.findFirst({
          where: {
            identifier: email,
            token: otp,
            expires: { gt: new Date() },
          },
        });

        if (!token) return null;

        await prisma.verificationToken.delete({
          where: { identifier_token: { identifier: email, token: otp } },
        });

        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          user = await prisma.user.create({
            data: { email, emailVerified: new Date() },
          });
        }
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      if (token.email) {
        const adminEmails = ["tejxshrivastava@gmail.com", "amanbashera29@gmail.com", "amanbashera00@gmail.com"];
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { role: true, id: true, createdAt: true },
        });
        if (dbUser) {
          if (dbUser.role === "customer" && adminEmails.includes(token.email)) {
            await prisma.user.update({ where: { id: dbUser.id }, data: { role: "admin" } });
            dbUser.role = "admin";
          }
          token.role = dbUser.role;
          token.id = dbUser.id;
          token.memberSince = dbUser.createdAt.toISOString();
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.memberSince = token.memberSince as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
});
