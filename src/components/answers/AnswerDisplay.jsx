"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useMemo,
} from "react";
import styled from "styled-components";
import BlockRenderer from "./BlockRenderer"; // 분리된 블록 렌더러를 가져옵니다.
import { useSelector, useDispatch } from "react-redux";
// 아이콘 및 Next.js 이미지 컴포넌트
import { FaPencilAlt, FaSave, FaTimes, FaTrash } from "react-icons/fa";
import Image from "next/image";
import profilePic from "@/assets/profile.png";
import UserProfile from "@/components/common/UserProfile";
import DropdownMenu from "@/components/common/DropdownMenu";
import ThemedEditor from "@/components/ThemeEditor";
import { useParams } from "next/navigation";
import {
  createAdoptComment,
  createLikeComment,
  deleteComment,
  updateComment,
} from "@/redux/slices/commentSlice";
import { useModal } from "../../context/ModalContext";
import ActionButtons from "../common/ActionButtons";
// =============================================================================
// 🎨 Styled Components
// =============================================================================

const MetaContainer = styled.div`
  display: flex;
  width: 100%;
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

const AnswerContainer = styled.div`
  padding-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const AnswerHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ProfileImage = styled(Image)`
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.border};
`;

const AuthorDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const AuthorName = styled.span`
  font-weight: ${({ theme }) => theme.font.weight.bold};
  font-size: 1.1rem;
`;

const Timestamp = styled.span`
  font-size: ${({ theme }) => theme.font.size.caption};
  color: ${({ theme }) => theme.text_secondary};
`;

const MedalContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
  }
`;

const MedalBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  font-size: ${({ theme }) => theme.font.size.small};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  background-color: ${({ theme, type }) =>
    type === "likes" ? `${theme.error}1A` : `${theme.success}1A`};
  color: ${({ theme, type }) =>
    type === "likes" ? theme.error : theme.success};
`;

const ContentWrapper = styled.div`
  position: relative;
  padding: 10px;
  border: 1px solid grey;
  border-radius: 18px;

  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  &:hover {
    transform: scale(1.05);
    cursor: pointer;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.7);
  }
`;
// 수정/저장/취소 버튼들을 담는 컨테이너
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
// =============================================================================
// 📖 답변 표시 컴포넌트
// =============================================================================

function AnswerDisplay({ answerData }) {
  const [isEditing, setIsEditing] = useState(false);

  const isQuestionAuthor = useSelector(
    (state) => state.question.currentQuestion.author
  );
  const isAdopted = useSelector((state) => state.comment.isAdopted);
  const editorRef = useRef(null);
  const params = useParams();
  const dispatch = useDispatch();
  const { openModal } = useModal();
  const parsedContent = useMemo(() => {
    if (!answerData?.content) return null;
    try {
      return typeof answerData.content === "string"
        ? JSON.parse(answerData.content)
        : answerData.content;
    } catch (e) {
      console.error("답변 콘텐츠 파싱 오류:", e);
      return null;
    }
  }, [answerData?.content]);
  const dropdownOptions = [
    {
      label: "수정",
      icon: <FaPencilAlt />,
      onClick: () => setIsEditing(true),
    },
    {
      label: "삭제",
      icon: <FaTrash />,
      onClick: () => {
        handleDelete();
      },
      isDelete: true,
    },
  ];

  if (!answerData) return null;

  const {
    author,
    createdAt,
    content,
    commentId,
    isAuthor,
    adopt,
    likeCount,
    likeStatus,
  } = answerData;

  const handleUpdate = async () => {
    if (!editorRef.current) return;
    const editedContentData = await editorRef.current.save();
    const body = {
      questionId: params.id,
      commentId,
      commentContent: editedContentData,
    };
    console.log(body);
    dispatch(updateComment(body))
      .unwrap()
      .then(() => {
        openModal({
          title: "수정 완료!",
          message: "답변 내용이 성공적으로 수정되었습니다.",
        });
        setIsEditing(false);
      })
      .catch((err) => {
        alert(`수정에 실패했습니다: ${err.message}`);
      });
  };

  const handleDelete = async () => {
    const body = {
      commentId,
    };
    console.log(body);
    dispatch(deleteComment(body))
      .unwrap()
      .then(() => {
        openModal({
          title: "삭제 완료!",
          message: "답변 내용이 성공적으로 삭제되었습니다.",
          onConfirm: () => window.location.reload(),
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const onLikeClick = () => {
    console.log("HI");
    const body = {
      commentId,
    };
    dispatch(createLikeComment(body));
  };
  const onAdoptClick = () => {
    console.log("HI");
    const body = {
      questionId: params.id,
      commentId,
    };
    dispatch(createAdoptComment(body));
  };

  return (
    <AnswerContainer>
      <AnswerHeader>
        <MetaContainer>
          <AuthorInfo>
            <UserProfile
              name={author.name || "사용자"}
              profileImage={profilePic}
              likeLevel={Number(author.likeBadge) || 1}
              adoptionLevel={Number(author.adoptBadge) || 1}
            />
            <span>·</span>
            <span>{new Date(createdAt).toLocaleDateString()}</span>
          </AuthorInfo>

          {isAuthor && <DropdownMenu options={dropdownOptions} />}
        </MetaContainer>
      </AnswerHeader>

      <ActionButtons
        isAuthor={isQuestionAuthor}
        adopt={adopt}
        isAdopted={isAdopted}
        likeCount={likeCount}
        likeStatus={likeStatus}
        onAdoptClick={onAdoptClick}
        onLikeClick={onLikeClick}
      />

      {!isEditing && (
        <ContentWrapper onClick={() => setIsEditing(true)}>
          <BlockRenderer blocks={content.blocks} />
        </ContentWrapper>
      )}

      {isEditing && (
        <React.Fragment>
          <ThemedEditor
            editorType={"answer"}
            holderId={"answer-edit-form"}
            editorRef={editorRef}
            initialData={content}
          />

          <ActionButtonsContainer>
            <ActionButton onClick={() => setIsEditing(false)}>
              <FaTimes /> 취소
            </ActionButton>
            <ActionButton
              primary
              onClick={handleUpdate}
              /* disabled={updateStatus === "loading"} */
            >
              <FaSave />{" "}
              {/* {updateStatus === "loading" ? "저장 중..." : "저장"} */}
            </ActionButton>
          </ActionButtonsContainer>
        </React.Fragment>
      )}
    </AnswerContainer>
  );
}

export default AnswerDisplay;
