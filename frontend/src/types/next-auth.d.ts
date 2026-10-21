import { DefaultSession } from "next-auth";
import "next-auth/jwt";

// Module augmentation: adds our own fields to the types that NextAuth already has

declare module "next-auth" {
  // What authorize() returns
  interface User {
    role: string;
    professionalField: string;
    accessToken: string;
  }

  // What the app sees with auth() and useSession()
  interface Session {
    accessToken: string;
    user: {
      id: string;
      role: string;
      professionalField: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  // What is stored in the encrypted cookie
  interface JWT {
    userId: string;
    role: string;
    professionalField: string;
    accessToken: string;
  }
}
