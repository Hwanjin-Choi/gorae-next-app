"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchQuestions,
  setKeyword,
  setCurrentPage,
} from "../../redux/slices/searchSlice";
import QuestionPreview from "@/components/QuestionPreview";
import Pagination from "@/components/Pagination";
import styled from "styled-components";
import { getUserStatus } from "@/redux/slices/userSlice";

// 이 props는 Providers 컴포넌트에서 React.cloneElement를 통해 전달됩니다.
export default function SearchPage() {
  const dispatch = useDispatch();
  const { questions, currentPage, totalPages, status, error, keyword } =
    useSelector((state) => state.search);
  const [inputKeyword, setInputKeyword] = useState("");

  // 컴포넌트 첫 로드 시, 기본 데이터(빈 검색어)를 요청합니다.
  useEffect(() => {
    dispatch(fetchQuestions({ keyword: "", page: 1, offset: 10 }));
  }, [dispatch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setKeyword(inputKeyword));
    dispatch(setCurrentPage(1));
    dispatch(fetchQuestions({ keyword: inputKeyword, page: 1, offset: 10 }));
  };

  const handlePageChange = (pageNumber) => {
    const currentKeyword = keyword;
    dispatch(setCurrentPage(pageNumber));
    dispatch(
      fetchQuestions({
        keyword: currentKeyword ? currentKeyword : "",
        page: pageNumber,
        offset: 10,
      })
    );
  };
  useEffect(() => {
    dispatch(getUserStatus());
  }, []);

  return (
    <PageContainer>
      <SearchForm onSubmit={handleSearchSubmit}>
        <SearchInput
          type="text"
          value={inputKeyword}
          onChange={(e) => setInputKeyword(e.target.value)}
          placeholder="지식의 바다, 검색해보세요!"
        />
        <SearchButton type="submit">검색</SearchButton>
      </SearchForm>

      {status === "loading" && (
        <StatusMessage>데이터를 불러오는 중입니다...</StatusMessage>
      )}
      {status === "failed" && (
        <StatusMessage>검색 결과가 없습니다 </StatusMessage>
      )}

      <QuestionsList>
        {status === "succeeded" && questions.length > 0
          ? questions.map((q) => (
              <QuestionPreview key={q.questionId} question={q} />
            ))
          : status === "succeeded" && (
              <StatusMessage>검색 결과가 없습니다.</StatusMessage>
            )}
      </QuestionsList>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </PageContainer>
  );
}

const PageContainer = styled.main`
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 2rem;
`;
const Header = styled.header`
  text-align: center;
  margin-bottom: 2.5rem;

  h1 {
    margin-bottom: 0.5rem;
    color: ${({ theme }) => theme.text};
  }

  p {
    font-size: ${({ theme }) => theme.font.size.body};
    color: ${({ theme }) => theme.text_secondary};
  }
`;
const SearchForm = styled.form`
  display: flex;
  margin-bottom: 2.5rem;
  gap: 0.5rem;
`;
const SearchInput = styled.input`
  flex-grow: 1;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.bg_page};
  color: ${({ theme }) => theme.text};

  &::placeholder {
    color: ${({ theme }) => theme.text_subtle};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}30;
  }
`;
const SearchButton = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.font.weight.medium};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;
const QuestionsList = styled.div`
  min-height: 200px;
`;
const StatusMessage = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.text_secondary};
  padding: 2rem 0;
`;
