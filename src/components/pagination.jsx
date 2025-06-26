"use client";
import styled from "styled-components";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Nav>
      {pageNumbers.map((number) => (
        <PageButton
          key={number}
          onClick={() => onPageChange(number)}
          $active={number === currentPage}
        >
          {number}
        </PageButton>
      ))}
    </Nav>
  );
};

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;
const PageButton = styled.button`
  padding: 0.5rem 0.85rem;
  border-radius: 6px;
  font-weight: ${({ theme }) => theme.font.weight.medium};
  cursor: pointer;
  transition: all 0.2s;

  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.primary : theme.border)};
  background-color: ${({ theme, $active }) =>
    $active ? theme.primary : theme.bg_page};
  color: ${({ theme, $active }) =>
    $active ? theme.bg_page : theme.text_secondary};

  &:hover {
    border-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.primary};
  }
`;

export default Pagination;
