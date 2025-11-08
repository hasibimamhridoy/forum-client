// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";
// Define a service using a base URL and expected endpoints

export const forumApi = createApi({
  reducerPath: "forumApi",
  tagTypes: ["Threads", "Thread", "Posts", "Post", "Notification", "User"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVICE_API_URL,
    credentials: "include",
    prepareHeaders: async (headers, { getState }) => {
      const sessionToken = await getSession();
      // console.log(sessionToken, 'sessionToken')
      if ((sessionToken as any)?.token?.accessToken) {
        headers.set(
          "authorization",
          `${(sessionToken as any)?.token?.accessToken}`
        );
      }
      return headers;
    },
  }),

  endpoints: () => ({}),
});
