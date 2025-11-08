import { configureStore } from "@reduxjs/toolkit";
import { forumApi } from "./basiApi";
export const store = configureStore({
  reducer: {
    [forumApi.reducerPath]: forumApi.reducer,
  },
  middleware: (getDefaultMiddlewares) =>
    getDefaultMiddlewares({}).concat(forumApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
