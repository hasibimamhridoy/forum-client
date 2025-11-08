import { forumApi } from "@/redux/basiApi";

export const adminApi = forumApi.injectEndpoints({
  endpoints: (builder) => ({
    createFlag: builder.mutation({
      query: ({ postId }) => ({
        url: `/admin/posts/${postId}/flag`,
        method: "PATCH",
        body: { postId },
      }),
      invalidatesTags: ["Posts"],
    }),
    createUnFlag: builder.mutation({
      query: ({ postId }) => ({
        url: `/admin/posts/${postId}/unflag`,
        method: "PATCH",
        body: { postId },
      }),
      invalidatesTags: ["Posts"],
    }),
  }),
});

export const { useCreateFlagMutation, useCreateUnFlagMutation } = adminApi;
