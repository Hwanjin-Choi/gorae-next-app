"use client";

import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchQuestionById,
  clearCurrentQuestion,
  updateQuestion,
  deleteQuestion,
} from "../../../redux/slices/questionSlice";
import { useModal } from "../../../context/ModalContext";
import { useParams, useRouter } from "next/navigation";

import BlockRenderer from "../../../components/answers/BlockRenderer";
import QuestionDetailSkeleton from "../../../components/common/QuestionDetailSkeleton";
import ThemedEditor from "../../../components/ThemeEditor";
import UserProfile from "@/components/common/UserProfile";
import DropdownMenu from "@/components/common/DropdownMenu";
import CommentCreateSection from "./CommentCreateSection";
import { FaPencilAlt, FaSave, FaTimes, FaTrash } from "react-icons/fa";
import profilePic from "@/assets/profile.png";
import CommentSection from "./CommentSection";

// =============================================================================
// 🎨 Styled Components (수정됨)
// =============================================================================

const scaleUp = keyframes`
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const ArticleContainer = styled.article`
  padding-top: 2rem;
`;

const QuestionHeader = styled.header`
  margin-bottom: 3rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const QuestionTitle = styled.h1`
  ${({ theme }) => theme.typography.h1};
  margin-bottom: 1rem;
`;

const MetaContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    & > div:last-child {
      align-self: flex-end;
    }
  }
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${({ theme }) => theme.text_secondary};
  flex-wrap: wrap;
`;

const ErrorMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.error};
  font-size: 1.2rem;
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme, primary }) =>
    primary ? theme.primary : theme.bg_page};
  color: ${({ theme, primary }) => (primary ? "white" : theme.text)};

  &:hover {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TitleInput = styled.input`
  width: 100%;
  font-size: 2.5rem;
  font-weight: bold;
  border: none;
  background: transparent;
  outline: none;
  color: ${({ theme }) => theme.text};
  border-bottom: 2px solid ${({ theme }) => theme.border};
  padding: 0.5rem 0;
  margin-bottom: 2rem;
  font-family: ${({ theme }) => theme.font.family.main};
`;

const AnswerSection = styled.section`
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 3px solid ${({ theme }) => theme.border};
`;

const AnswerSectionTitle = styled.h2`
  ${({ theme }) => theme.typography.h2};
  margin-bottom: 1rem;
`;

const FloatingAnswerButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 50vw;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 9999px;
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.font.weight.bold};
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.utils.shadow_lg};
  z-index: 50;
  animation: ${scaleUp} 0.3s ease-out;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    bottom: 1.5rem;
    right: 1.5rem;
  }
`;

// =============================================================================
// 📖 질문 상세 페이지
// =============================================================================

export default function QuestionDetailPage() {
  const dispatch = useDispatch();
  const { openModal } = useModal();
  const editorRef = useRef(null);
  const params = useParams();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [parsedContent, setParsedContent] = useState(null);

  // --- 개선안 적용 1 ---
  const [isAnswerFormVisible, setIsAnswerFormVisible] = useState(false);
  const answerSectionRef = useRef(null);

  const { currentQuestion, detailStatus, updateStatus, currentQuestionAuthor } =
    useSelector((state) => state.question);
  const currentUser = { id: "bok" };

  useEffect(() => {
    if (params.id) {
      dispatch(fetchQuestionById(params.id));
    }
    /* return () => {
      dispatch(clearCurrentQuestion());
    }; */
  }, [params.id]);

  useEffect(() => {
    if (currentQuestion) {
      setEditedTitle(currentQuestion.title);
      try {
        const content =
          typeof currentQuestion.detailContent === "string"
            ? JSON.parse(currentQuestion.detailContent)
            : currentQuestion.detailContent;
        setParsedContent(content);
      } catch (e) {
        console.error("콘텐츠 파싱 오류:", e);
        setParsedContent(null);
      }
    }
  }, [currentQuestion]);

  // --- 개선안 적용 2 ---
  useEffect(() => {
    if (isAnswerFormVisible && answerSectionRef.current) {
      answerSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [isAnswerFormVisible]);

  const handleUpdate = async () => {
    if (!editorRef.current) return;
    const editedContentData = await editorRef.current.save();
    const body = {
      questionId: params.id,
      title: editedTitle,
      content: editedContentData,
    };

    dispatch(updateQuestion(body))
      .unwrap()
      .then(() => {
        openModal({
          title: "수정 완료!",
          message: "질문 내용이 성공적으로 수정되었습니다.",
        });
        setIsEditing(false);
      })
      .catch((err) => {
        alert(`수정에 실패했습니다: ${err.message}`);
      });
  };

  const handleDelete = async () => {
    const body = {
      questionId: params.id,
    };

    dispatch(deleteQuestion(body))
      .unwrap()
      .then(() => {
        openModal({
          title: "삭제 완료!",
          message: "질문 내용이 성공적으로 삭제되었습니다.",
          onConfirm: () => (window.location.href = "/view"),
        });
      })
      .catch((err) => {
        alert(`질문 삭제에 실패했습니다: ${err.message}`);
      });
  };

  if (detailStatus === "loading" || detailStatus === "idle") {
    return <QuestionDetailSkeleton />;
  }
  if (detailStatus === "failed") {
    return <ErrorMessage>존재하지 않는 질문글이에요.</ErrorMessage>;
  }

  if (detailStatus === "succeeded" && currentQuestion) {
    const isAuthor = currentUser.id === currentQuestion.userInfo?.userId;
    const dropdownOptions = [
      {
        label: "수정",
        icon: <FaPencilAlt />,
        onClick: () => setIsEditing(true),
      },
      {
        label: "삭제",
        icon: <FaTrash />,
        onClick: handleDelete,
        isDelete: true,
      },
    ];

    return (
      <ArticleContainer>
        {isEditing ? (
          <>
            <TitleInput
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <ThemedEditor
              editorType={"question"}
              holderId={"question-edit-form"}
              editorRef={editorRef}
              initialData={parsedContent}
            />
          </>
        ) : (
          <>
            <QuestionHeader>
              <QuestionTitle>{currentQuestion.title}</QuestionTitle>
              <MetaContainer>
                <AuthorInfo>
                  <UserProfile
                    name={currentQuestion.userInfo?.userName || "사용자"}
                    profileImage={profilePic}
                    likeLevel={5}
                    adoptionLevel={5}
                  />
                  <span>·</span>
                  <span>
                    {new Date(currentQuestion.updateAt).toLocaleDateString()}
                  </span>
                </AuthorInfo>

                {currentQuestionAuthor && (
                  <DropdownMenu options={dropdownOptions} />
                )}
              </MetaContainer>
            </QuestionHeader>
            <BlockRenderer blocks={parsedContent?.blocks} />

            {isAnswerFormVisible ? (
              <AnswerSection ref={answerSectionRef}>
                <AnswerSectionTitle>답변하기</AnswerSectionTitle>
                <CommentCreateSection
                  onClose={() => setIsAnswerFormVisible(false)}
                />
              </AnswerSection>
            ) : (
              <FloatingAnswerButton
                onClick={() => setIsAnswerFormVisible(true)}
              >
                <FaPencilAlt /> 답변하기
              </FloatingAnswerButton>
            )}
          </>
        )}

        {isAuthor && isEditing && (
          <ActionButtonsContainer>
            <ActionButton onClick={() => setIsEditing(false)}>
              <FaTimes /> 취소
            </ActionButton>
            <ActionButton
              primary
              onClick={handleUpdate}
              disabled={updateStatus === "loading"}
            >
              <FaSave /> {updateStatus === "loading" ? "저장 중..." : "저장"}
            </ActionButton>
          </ActionButtonsContainer>
        )}

        <CommentSection />
      </ArticleContainer>
    );
  }

  return <div>질문 정보를 찾을 수 없습니다.</div>;
}
