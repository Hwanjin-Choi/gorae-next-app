import React, { createContext, useState, useContext, useMemo } from "react";

// 1. Context 객체 생성
const ErrorContext = createContext(null);

// 2. Context를 사용하기 위한 커스텀 훅
export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError는 반드시 ErrorProvider 안에서 사용해야 합니다.");
  }
  return context;
};

// 3. 상태와 함수를 제공하는 Provider 컴포넌트
export function ErrorProvider({ children }) {
  // 오류 상태를 단일 문자열이 아닌, 객체로 관리합니다.
  const [errors, setErrors] = useState({});

  // 매번 새로운 객체가 생성되는 것을 방지하기 위해 useMemo를 사용합니다.
  const value = useMemo(() => ({ errors, setErrors }), [errors]);

  return (
    <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
  );
}
