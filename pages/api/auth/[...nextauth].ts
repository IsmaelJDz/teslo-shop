import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { dbUsers } from "../../../database";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    // ...add more providers here
    Credentials({
      name: "Custom Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials, req) {
        return await dbUsers.checkEmailPassword(
          credentials!.email,
          credentials!.password
        );

        //return { name: "John Doe", email: "example@example.com", role: "admin" };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },
  jwt: {},
  session: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    strategy: "jwt",
    updateAge: 1000 * 60 * 60 * 24, // 1 day
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        switch (account.type) {
          case "oauth":
            //Create o verify user exists in your database
            token.user = await dbUsers.verifyOathUser(
              user?.email || "",
              user?.name || ""
            );
            break;

          case "credentials":
            token.user = user;
            break;
        }
      }

      return token;
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken;
      session.user = token.user as any;

      return session;
    },
  },
});
