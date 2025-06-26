"use client";

import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  useCallback,
} from "react";
import SuccessModal from "../components/common/SuccessModal";

// 1. Context 객체 생성
const ModalContext = createContext(null);

// 2. Context 사용을 위한 커스텀 훅
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal은 반드시 ModalProvider 안에서 사용해야 합니다.");
  }
  return context;
};

// 3. Provider 컴포넌트
export function ModalProvider({ children }) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const openModal = useCallback(({ title, message, onConfirm }) => {
    setModalState({
      isOpen: true,
      title,
      message,
      onConfirm: onConfirm,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState((prevState) => ({ ...prevState, isOpen: false }));
  }, []);

  const value = useMemo(
    () => ({ openModal, closeModal }),
    [openModal, closeModal]
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
      <SuccessModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        onConfirm={modalState.onConfirm}
      />
    </ModalContext.Provider>
  );
}
