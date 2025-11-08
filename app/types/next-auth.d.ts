import "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      accessToken: string;
      userName: string;
      role: "user" | "moderator" | "admin";
      email: string;
      userId: string;
    };
    token: {
      /** The user's postal address. */
      accessToken: string;
      userName: string;
      role: "user" | "moderator" | "admin";
      email: string;
      userId: string;
    };
  }
}
