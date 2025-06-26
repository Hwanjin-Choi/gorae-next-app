"use client";

import React, { useRef, useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { useRouter } from "next/navigation";
import axios from "axios";

import ThemedEditor from "../../components/ThemeEditor";
import {
  pageTitles,
  pageSubtitles,
  editorBodyPlaceholders,
  getRandomItem,
} from "../../assets/RandomPhrases";
import { ErrorProvider, useError } from "../../context/ErrorContext";
import { FaExclamationCircle } from "react-icons/fa";
import { useModal } from "../../context/ModalContext";
import apiClient from "@/api";

// =============================================================================
// 🎨 Styled Components (이전과 동일)
// =============================================================================

const PageContainer = styled.div`
  width: 100%;
  margin: 0 auto;
`;

const Header = styled.header`
  margin-bottom: 2.5rem;
  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`;

const PageTitle = styled.h2`
  ${({ theme }) => theme.typography.h2};
  margin-bottom: 0.5rem;
`;

const PageSubtitle = styled.p`
  ${({ theme }) => theme.typography.body};
  color: ${({ theme }) => theme.text_secondary};
`;

const PostTitleInput = styled.input`
  width: 100%;
  background-color: ${({ theme }) => theme.bg_page};
  color: ${({ theme }) => theme.text};
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  height: 56px;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  transition: border-color 0.2s;

  &::placeholder {
    color: ${({ theme }) => theme.text_subtle};
  }

  ${({ isError }) =>
    isError &&
    css`
      border-color: ${({ theme }) => theme.error};
      &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.error};
      }
    `}
`;

const EditorContainer = styled.div`
  & > div {
    transition: border-color 0.2s;
    border-color: ${({ isError, theme }) =>
      isError ? theme.error : theme.border};
  }
`;

const SubmitButton = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  font-size: ${({ theme }) => theme.font.size.body};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  border: none;
  border-radius: 6px;
  padding: 0.75rem 2rem;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.utils.shadow_sm};
  transition: transform 0.2s, box-shadow 0.2s;
  float: right;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.utils.shadow_md};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.text_subtle};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.error};
  font-size: ${({ theme }) => theme.font.size.caption};
  margin-top: -0.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

// =============================================================================
// 📖 페이지 로직
// =============================================================================

function AskQuestionForm() {
  const router = useRouter();
  const editorInstanceRef = useRef(null);
  const [title, setTitle] = useState("");
  const { errors, setErrors } = useError();
  const [phrases, setPhrases] = useState({
    title: "",
    subtitle: "",
    editorBodyPlaceholder: "",
  });
  const { openModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPhrases({
      title: getRandomItem(pageTitles),
      subtitle: getRandomItem(pageSubtitles),
      editorBodyPlaceholder: getRandomItem(editorBodyPlaceholders),
    });
  }, []);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (errors.title) {
      setErrors((prevErrors) => ({ ...prevErrors, title: null }));
    }
  };

  const handleSave = async () => {
    if (isLoading) return; // 로딩 중 중복 클릭 방지
    if (!editorInstanceRef.current) return;

    // --- 유효성 검사 ---
    const editorData = await editorInstanceRef.current.save();
    const validationErrors = {};
    if (!title.trim()) validationErrors.title = "제목을 입력해주십시오.";
    if (editorData.blocks.length === 0)
      validationErrors.content = "내용을 입력해주십시오.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true); // 5. API 호출 시작

    // --- API 요청 페이로드 생성 ---
    const requestPayload = {
      title: title,
      content: editorData, // 백엔드 DTO가 객체를 받는다면 그대로 전달
    };

    console.log(requestPayload);

    // --- API 호출 ---
    try {
      const response = await apiClient.post(
        "/post/v1/questions/create",
        requestPayload
      );

      const newQuestionId = response.data.data;

      openModal({
        title: "질문 등록 성공!",
        message: `새로운 질문이 성공적으로 등록되었습니다`,
        onConfirm: () => router.push(`/question/${newQuestionId}`),
      });
    } catch (error) {
      console.error("질문 등록 실패:", error);
      alert("질문 등록에 실패하였습니다. 다시 시도해주십시오.");
    } finally {
      setIsLoading(false); // 7. API 호출 종료 (성공/실패 무관)
    }
  };

  return (
    <PageContainer>
      <Header>
        <PageTitle>{phrases.title}</PageTitle>
        <PageSubtitle>{phrases.subtitle}</PageSubtitle>
      </Header>
      <main>
        <PostTitleInput
          placeholder="지식의 바다, 무엇이든 물어보세요!"
          value={title}
          onChange={handleTitleChange}
          isError={!!errors.title}
        />
        {errors.title && (
          <ErrorMessage>
            <FaExclamationCircle />
            {errors.title}
          </ErrorMessage>
        )}

        <EditorContainer isError={!!errors.content}>
          <ThemedEditor
            editorRef={editorInstanceRef}
            bodyPlaceholder={phrases.editorBodyPlaceholder}
          />
        </EditorContainer>
        {errors.content && (
          <ErrorMessage style={{ marginTop: "0.5rem" }}>
            <FaExclamationCircle />
            {errors.content}
          </ErrorMessage>
        )}

        <SubmitButton onClick={handleSave} disabled={isLoading}>
          {isLoading ? "등록 중..." : "질문 등록하기"}
        </SubmitButton>
      </main>
    </PageContainer>
  );
}

function AskQuestionPage() {
  return (
    <ErrorProvider>
      <AskQuestionForm />
    </ErrorProvider>
  );
}

// Next.js의 App Router 방식에서는 이 부분이 페이지의 진입점이 됩니다.
export default function AskPage() {
  return <AskQuestionPage />;
}
