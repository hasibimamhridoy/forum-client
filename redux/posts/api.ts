import { forumApi } from "@/redux/basiApi";

const postsApi = forumApi.injectEndpoints({
  endpoints: (builder) => ({
    // Posts
    getPosts: builder.query({
      query: ({ threadId, page = 1, limit = 50 }) => ({
        url: `/posts/thread/${threadId}`,
        params: { page, limit },
      }),
      providesTags: (result, error, { threadId }) => [
        { type: "Post", id: threadId },
      ],
    }),
    updatePost: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/posts/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Post", id }],
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsApi;
