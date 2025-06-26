// src/components/common/Pagination.jsx
import React from "react";
import styled from "styled-components";

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  gap: 0.5rem;
`;

const PageButton = styled.button`
  padding: 0.5rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background-color: ${({ theme, isActive }) =>
    isActive ? theme.colors.primary : theme.colors.background};
  color: ${({ theme, isActive }) => (isActive ? "#fff" : theme.colors.text)};
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s, color 0.2s;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.hover};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

/**
 * 페이지네이션 컴포넌트
 * @param {object} props
 * @param {number} props.currentPage 현재 페이지
 * @param {number} props.totalPages 전체 페이지 수
 * @param {function(number): void} props.onPageChange 페이지 변경 핸들러
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // 전체 페이지가 1개 이하일 경우 페이지네이션을 표시하지 않음
  if (totalPages <= 1) {
    return null;
  }

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // 페이지 번호 배열 생성
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <PaginationContainer>
      <PageButton onClick={handlePrev} disabled={currentPage === 1}>
        이전
      </PageButton>
      {pageNumbers.map((number) => (
        <PageButton
          key={number}
          isActive={number === currentPage}
          onClick={() => onPageChange(number)}
        >
          {number}
        </PageButton>
      ))}
      <PageButton onClick={handleNext} disabled={currentPage === totalPages}>
        다음
      </PageButton>
    </PaginationContainer>
  );
};

export default Pagination;
