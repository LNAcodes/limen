/**
 * NextAuth setup for Limen
 *
 * Login method: Credentials (email and password)
 *   authorize:
 *     1. send email and password to POST /auth/login (NestJS backend)
 *     2. not ok → return null (login failed)
 *     3. read the accessToken from the response
 *     4. ask GET /auth/me with the token → get the user
 *     5. return the user together with the token
 *
 * Session: stored in an encrypted cookie (strategy "jwt")
 * Own login page: /login
 *
 * Callbacks:
 *   jwt:     at login, store the user data and token in the cookie once
 *   session: read the data from the cookie and expose it to the app
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      // Runs on the Next.js server: asks the NestJS backend if email and password are correct
      async authorize(credentials) {
        const loginResponse = await fetch(`${apiBaseUrl}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: String(credentials.email),
            password: String(credentials.password),
          }),
        });

        if (!loginResponse.ok) {
          return null;
        }

        const { accessToken } = await loginResponse.json();

        const meResponse = await fetch(`${apiBaseUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!meResponse.ok) {
          return null;
        }

        const loggedInUser = await meResponse.json();

        return {
          id: loggedInUser.id,
          name: loggedInUser.name,
          email: loggedInUser.email,
          role: loggedInUser.role,
          professionalField: loggedInUser.professionalField,
          accessToken: accessToken,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  // jwt: store data in the encrypted cookie once at login. session: expose it to the app
  callbacks: {
    jwt({ token, user }) {
      if (user && user.id) {
        token.userId = user.id;
        token.role = user.role;
        token.professionalField = user.professionalField;
        token.accessToken = user.accessToken;
      }

      return token;
    },

    session({ session, token }) {
      session.user.id = token.userId;
      session.user.role = token.role;
      session.user.professionalField = token.professionalField;
      session.accessToken = token.accessToken;

      return session;
    },
  },
});
