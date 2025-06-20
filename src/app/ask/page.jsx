"use client";
import React, { useRef, useState, useEffect } from "react";
import styled, { css } from "styled-components";
import ThemedEditor from "../../components/ThemeEditor";
import {
  pageTitles,
  pageSubtitles,
  editorBodyPlaceholders,
  getRandomItem,
} from "../../assets/RandomPhrases";
import { ErrorProvider, useError } from "../../context/ErrorContext";
import { FaExclamationCircle } from "react-icons/fa";

// =============================================================================
// 🎨 Styled Components
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

  /* isError prop이 true일 때, 테두리를 에러 색상으로 변경합니다. */
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

// 에디터 컨테이너에도 에러 스타일을 적용합니다.
const EditorContainer = styled.div`
  /* isError prop이 true일 때, ThemedEditor 주위에 빨간 테두리를 표시합니다. */
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
`;

// 에러 메시지를 표시할 컴포넌트
const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.error};
  font-size: ${({ theme }) => theme.font.size.caption};
  margin-top: -0.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

// 질문 작성 페이지의 주요 로직을 담는 내부 컴포넌트
function AskQuestionForm() {
  const editorInstanceRef = useRef(null);
  const [title, setTitle] = useState("");
  // **수정된 부분**: 이제 errors와 setErrors를 올바르게 사용합니다.
  const { errors, setErrors } = useError();
  const [phrases, setPhrases] = useState({
    title: "",
    subtitle: "",
    editorBodyPlaceholder: "",
  });

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
    if (!editorInstanceRef.current) return;

    const editorData = await editorInstanceRef.current.save();
    const validationErrors = {};

    if (!title.trim()) {
      validationErrors.title = "제목을 입력해주십시오.";
    }

    if (editorData.blocks.length === 0) {
      validationErrors.content = "내용을 입력해주십시오.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    console.log("저장될 제목:", title);
    console.log("저장될 내용:", JSON.stringify(editorData));
    alert("질문이 성공적으로 등록되었습니다. (콘솔 확인)");
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

        <SubmitButton onClick={handleSave}>질문 등록하기</SubmitButton>
      </main>
    </PageContainer>
  );
}

// 최종적으로 페이지 컴포넌트를 ErrorProvider로 감싸서 내보냅니다.
function AskQuestionPage() {
  return (
    <ErrorProvider>
      <AskQuestionForm />
    </ErrorProvider>
  );
}

export default function AskPage() {
  return <AskQuestionPage />;
}
