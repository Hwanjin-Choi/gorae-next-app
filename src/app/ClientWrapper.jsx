// src/app/ClientWrapper.jsx
"use client";

import { ThemeProvider } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { lightTheme, darkTheme, GlobalStyle } from "../styles/theme";
import Header from "@/components/Header";
import { useEffect } from "react";
import { syncThemeWithSystem } from "../redux/slices/themeSlice";
import styled from "styled-components";
import { ModalProvider } from "@/context/ModalContext";

const MainContentContainer = styled.main`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 2rem;
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

export default function ClientWrapper({ children }) {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.mode);

  // 컴포넌트가 클라이언트에 마운트된 후, 딱 한 번만 실행됩니다.
  useEffect(() => {
    // 저장된 테마가 없다면, OS 설정을 확인하고 동기화하는 액션을 보냅니다.
    const savedTheme = localStorage.getItem("persist:root");
    if (!savedTheme || !JSON.parse(savedTheme).theme) {
      dispatch(syncThemeWithSystem());
    }
  }, [dispatch]);

  // redux-persist가 상태를 불러오는 동안 themeMode가 null일 수 있으므로,
  // 이 경우 기본 테마를 잠시 보여주거나 로딩 화면을 보여주는 것이 좋습니다.
  const currentTheme = themeMode === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle />
      {/* Redux 상태가 완전히 로드되기 전까지 Header 렌더링을 피하는 것이 안전할 수 있습니다. */}
      <ModalProvider>
        {themeMode && <Header />}
        <MainContentContainer>{children}</MainContentContainer>
      </ModalProvider>
    </ThemeProvider>
  );
}
