// Makes the NextAuth setup from src/auth.ts reachable under /api/auth/...
// [...nextauth] is a catch-all route: it handles every path after /api/auth/
// (e.g. /api/auth/session, /api/auth/signin, /api/auth/callback/credentials).
// NextAuth decides itself what happens at each path.
import { handlers } from "@/auth";

export const { GET, POST } = handlers;

/*
handlers = {
  GET: function, answers GET-Requests,
  POST: function, answers POST-Requests,
}
*/
