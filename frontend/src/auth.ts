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

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      // Runs on the Next.js server: asks the NestJS backend if email and password are correct
      async authorize(credentials)
    }),
  ],
});
