"use client";

import React from "react";
import styled, { keyframes } from "styled-components";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { FaCheckCircle, FaTimes } from "react-icons/fa";

// 애니메이션을 위한 키프레임 정의
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const scaleIn = keyframes`
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

// 스타일드 컴포넌트
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.bg_page};
  color: ${({ theme }) => theme.text};
  border-radius: 16px;
  padding: 2.5rem 3rem;
  width: 90%;
  max-width: 500px;
  text-align: center;
  position: relative;
  box-shadow: ${({ theme }) => theme.utils.shadow_lg};
  animation: ${scaleIn} 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.text_secondary};
  &:hover {
    color: ${({ theme }) => theme.text};
  }
`;

const IconWrapper = styled.div`
  color: ${({ theme }) => theme.success};
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const ModalTitle = styled.h2`
  ${({ theme }) => theme.typography.h3};
  margin-bottom: 0.75rem;
  font-weight: ${({ theme }) => theme.font.weight.bold};
`;

const ModalMessage = styled.p`
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ConfirmButton = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

const SuccessModal = ({ isOpen, onClose, title, message, onConfirm }) => {
  const { width, height } = useWindowSize();

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      {isOpen && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.1}
        />
      )}
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
        <IconWrapper>
          <FaCheckCircle />
        </IconWrapper>
        <ModalTitle>{title}</ModalTitle>
        <ModalMessage>{message}</ModalMessage>
        <ConfirmButton onClick={handleConfirm}>확인</ConfirmButton>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default SuccessModal;
