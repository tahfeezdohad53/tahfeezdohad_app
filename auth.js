import axios from "axios";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, user }) {
      // console.log('jwt callback')
      const cookieStore = await cookies();
      const role = cookieStore.get('role')?.value;
      if (account) {
        // console.log("session");
        try {
          const signedJwt = jwt.sign(
            { email: profile.email, name: profile.name, role },
            process.env.JWT_SECRET,
          );
          // console.log(process.env.URL)
          const res = await axios.post(
            `${process.env.URL}/auth/signin`,
            {},
            {
              headers: {
                Authorization: `Bearer ${signedJwt}`,
              },
            },
          );
          console.log(res.data);
          token.jwt = res.data.jwt;
          token.user = res.data.user;
        } catch (err) {
          console.log(err);
          throw new Error("failed");
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.jwt = token.jwt;
      session.currentUser = token.user;
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge:10 * 24 * 60 * 60
  },
  pages: {
    signIn: "/auth",
    error: "/error",
  },
});
