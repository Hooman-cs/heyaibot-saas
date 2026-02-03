import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import AppleProvider from "next-auth/providers/apple";
import { getUserByEmail, createUser } from "@/lib/user-db";
import bcrypt from "bcryptjs";

export const authOptions = {
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    AzureADProvider({
      clientId: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      tenantId: process.env.MICROSOFT_TENANT_ID, 
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET, 
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) throw new Error("Missing inputs");
        
        const user = await getUserByEmail(credentials.email);
        if (!user) throw new Error("User not found");
        if (!user.password) throw new Error("Please use your social login");

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid password");

        return { id: user.email, name: user.name, email: user.email, plan: user.plan };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider !== "credentials") {
        const existingUser = await getUserByEmail(user.email);
        if (!existingUser) {
          await createUser({
            name: user.name || profile?.name || "User",
            email: user.email,
            authProvider: account.provider,
            password: null 
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) token.plan = user.plan || "starter";
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.plan = token.plan;
      return session;
    }
  },
  pages: { signIn: "/auth/login" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };