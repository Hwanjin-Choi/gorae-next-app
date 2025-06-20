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
import storage from "redux-persist/lib/storage"; // localStorage를 사용합니다.
import themeReducer from "./slices/themeSlice";

// redux-persist 설정
const persistConfig = {
  key: "root", // localStorage에 저장될 때의 key
  version: 1,
  storage,
  whitelist: ["theme"], // 영속적으로 저장할 슬라이스 이름의 목록
};

// 여러 리듀서를 하나로 합칩니다. (추후 다른 슬라이스 추가 가능)
const rootReducer = combineReducers({
  theme: themeReducer,
  // user: userReducer, // 예시: 나중에 사용자 슬라이스 추가
});

// persist 설정을 적용한 리듀서를 생성합니다.
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 스토어를 설정합니다.
export const makeStore = () => {
  return {
    store: configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false, // redux-persist와 함께 사용할 때 오류 방지
        }),
    }),
  };
};

/* // 스토어의 영속성을 관리하는 persistor를 생성합니다.
export const persistor = persistStore(store); */
