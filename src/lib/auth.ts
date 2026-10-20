import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { twoFactor } from "better-auth/plugins";
import { prisma } from "@/lib/db";

export const auth = betterAuth({
  appName: "intimedo",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true, minPasswordLength: 12 },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "READER", input: false },
    },
  },
  plugins: [twoFactor({ issuer: "intimedo" })],
});
