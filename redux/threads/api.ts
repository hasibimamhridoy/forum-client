import { forumApi } from "@/redux/basiApi";

const threadsApi = forumApi.injectEndpoints({
  endpoints: (build) => ({
    getThreads: build.query({
      query: ({
        page = 1,
        limit = 20,
        search,
        category,
        sort = "-createdAt",
      }) => ({
        url: "/threads",
        params: { page, limit, search, category, sort },
      }),
      providesTags: ["Thread"],
    }),
    getThread: build.query({
      query: (id) => `/threads/${id}`,
      providesTags: (result, error, id) => [{ type: "Thread", id }],
    }),
    createThread: build.mutation({
      query: (body) => ({
        url: "/threads",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Thread"],
    }),
    createPost: build.mutation({
      query: (body) => ({
        url: "/posts",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { threadId }) => [
        { type: "Post", id: threadId },
      ],
    }),
    getThreadSummary: build.query({
      query: (threadId) => `/admin/threads/${threadId}/summary`,
    }),
  }),
});

export const {
  useGetThreadsQuery,
  useCreateThreadMutation,
  useCreatePostMutation,
  useGetThreadQuery,
  useLazyGetThreadSummaryQuery,
} = threadsApi;
