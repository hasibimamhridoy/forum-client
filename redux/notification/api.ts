import { forumApi } from "@/redux/basiApi";

export const notificationsApi = forumApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: ({ page = 1, limit = 20, unreadOnly = false }) => ({
        url: "/notifications",
        params: { page, limit, unreadOnly },
      }),
      providesTags: ["Notification"],
      keepUnusedDataFor: 60,
    }),
  }),
});

export const { useGetNotificationsQuery } = notificationsApi;
