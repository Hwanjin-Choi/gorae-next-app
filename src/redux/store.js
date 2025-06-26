import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import themeReducer from "./slices/themeSlice";
import questionReducer from "./slices/questionSlice";
import commentReducer from "./slices/commentSlice";
import userReducer from "./slices/userSlice.js";
import searchReducer from "./slices/searchSlice.js";
import leaderboardReducer from "./slices/leaderboardSlice";
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["theme", "question", "comment", "user", "search", "leaderboard"],
};

const rootReducer = combineReducers({
  theme: themeReducer,
  question: questionReducer,
  comment: commentReducer,
  user: userReducer,
  search: searchReducer,
  leaderboard: leaderboardReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  return {
    store: configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
    }),
  };
};
