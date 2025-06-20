// src/redux/slices/themeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // 서버에서는 항상 'light'로 시작하여 오류를 피합니다.
  mode: "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    // 클라이언트에서 OS 설정을 확인하고 동기화하는 액션을 추가합니다.
    syncThemeWithSystem: (state) => {
      // 이 코드는 클라이언트에서만 실행되어야 하므로, window 객체의 존재를 확인합니다.
      if (typeof window !== "undefined") {
        const systemPrefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        state.mode = systemPrefersDark ? "dark" : "light";
      }
    },
  },
});

export const { toggleTheme, syncThemeWithSystem } = themeSlice.actions;
export default themeSlice.reducer;
