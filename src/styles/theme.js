"use client";
import { createGlobalStyle, css } from "styled-components";

// =============================================================================
// 🎨 COLOR PALETTE (색상 팔레트)
// =============================================================================

export const lightTheme = {
  name: "light",
  primary: "#3B82F6",
  secondary: "#6D28D9",
  accent: "#F59E0B",
  bg: "#F8F9FA",
  bg_page: "#FFFFFF",
  bg_component: "#c6daed", // 라이트 모드용 컴포넌트 배경색 (추가)
  text: "#1F2937",
  text_secondary: "#6B7280",
  text_subtle: "#9CA3AF",
  border: "#E5E7EB",
  success: "#10B981",
  error: "#EF4444",
};

export const darkTheme = {
  name: "dark",
  primary: "#60A5FA",
  secondary: "#A78BFA",
  accent: "#FBBF24",
  bg: "#111827",
  bg_page: "#1F2937",
  bg_component: "#334155", // 다크 모드용 컴포넌트 배경색 (추가)
  text: "#F9FAFB",
  text_secondary: "#9CA3AF",
  text_subtle: "#6B7280",
  border: "#374151",
  success: "#34D399",
  error: "#F87171",
};

// =============================================================================
// ✍️ TYPOGRAPHY (타이포그래피)
// =============================================================================

const font = {
  family: {
    main: "'SUIT', 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif",
  },
  size: {
    h1: "2.5rem", // 40px
    h2: "2rem", // 32px
    h3: "1.75rem", // 28px
    h4: "1.5rem", // 24px
    body: "1rem", // 16px
    caption: "0.875rem", // 14px
    small: "0.75rem", // 12px
  },
  weight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

// =============================================================================
// 🧱 SHARED STYLES (공유 스타일)
// =============================================================================

const utils = {
  shadow_sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  shadow_md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  shadow_lg:
    "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  card: `
    background-color: ${({ theme }) => theme.bg_page};
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.border};
    box-shadow: ${({ theme }) => theme.utils.shadow_md};
    padding: 1.5rem;
  `,
};

const typography = {
  h1: css`
    font-size: ${({ theme }) => theme.font.size.h1}; /* 2.5rem */
    @media (max-width: 768px) {
      font-size: 2rem;
    }
  `,
  h2: css`
    font-size: ${({ theme }) => theme.font.size.h2}; /* 2rem */
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  `,
  h3: css`
    font-size: ${({ theme }) => theme.font.size.h3}; /* 1.75rem */
    @media (max-width: 768px) {
      font-size: 1.25rem;
    }
  `,
  h4: css`
    font-size: ${({ theme }) => theme.font.size.h4}; /* 1.5rem */
    @media (max-width: 768px) {
      font-size: 1rem;
    }
  `,
  body: css`
    font-size: ${({ theme }) => theme.font.size.body}; /* 1rem */
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  `,
};

// =============================================================================
// 🌐 GLOBAL STYLE (전역 스타일)
// =============================================================================

export const GlobalStyle = createGlobalStyle`
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
  @import url('https://cdn.jsdelivr.net/gh/sun-typeface/SUIT/fonts/variable/woff2/SUIT-Variable.css');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
  }

  body {
    background-color: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text};
    font-family: ${({ theme }) => theme.font.family.main};
    font-weight: ${({ theme }) => theme.font.weight.regular};
    line-height: 1.6;
    transition: background-color 0.3s, color 0.3s;
  }


  h1 { ${({ theme }) => theme.typography.h1}; }
  h2 { ${({ theme }) => theme.typography.h2}; }
  h3 { ${({ theme }) => theme.typography.h3}; }
  h4 { ${({ theme }) => theme.typography.h4}; }
  p { ${({ theme }) => theme.typography.body}; }

  h1, h2, h3, h4, h5, h6 {
    font-weight: ${({ theme }) => theme.font.weight.bold};
    color: ${({ theme }) => theme.text};
  }
  
  p {
    margin-bottom: 1rem;
  }

  p {
    font-size: ${({ theme }) => theme.font.size.body};
    margin-bottom: 1rem;
  }

  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  /* ======================================================= */
  /* 모바일 환경을 위한 반응형 타이포그래피 (새로 추가된 부분) */
  /* 화면 너비가 768px 이하일 때 적용됩니다.                  */
  /* ======================================================= */
  /* @media (max-width: 768px) {
    h1 { font-size: 1rem; }
    h2 { font-size: 0.75rem; }
    h3 { font-size: 0.5rem; }
    h4 { font-size: 0.25rem; }
    
    p {
      font-size: 0.95rem;
    }
  } */
`;

// 테마 객체에 font와 utils를 포함하여 export
lightTheme.font = font;
darkTheme.font = font;
lightTheme.utils = utils;
darkTheme.utils = utils;
lightTheme.typography = typography;
darkTheme.typography = typography;
