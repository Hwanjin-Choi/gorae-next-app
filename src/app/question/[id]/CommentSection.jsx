// src/app/question/[id]/CommentSection.jsx
"use client";

import React, { useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import {
  fetchCommentsByQuestionId,
  clearComments,
} from "@/redux/slices/commentSlice";
import AnswerDisplay from "@/components/answers/AnswerDisplay";
import QuestionDetailSkeleton from "@/components/common/QuestionDetailSkeleton";

const CommentsContainer = styled.section`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 3px solid ${({ theme }) => theme.border};
`;

const CommentsHeader = styled.h4`
  ${({ theme }) => theme.typography.h4};
  margin-bottom: 1.5rem;
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem; /* 답변과 답변 사이의 간격 */
`;

const EmptyMessage = styled.p`
  color: ${({ theme }) => theme.text_secondary};
  text-align: center;
  padding: 2rem;
`;

const ErrorMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.error};
  font-size: 1.2rem;
`;

function CommentSection() {
  const dispatch = useDispatch();
  const params = useParams();
  const questionId = params.id;

  const { comments, pagination, status } = useSelector(
    (state) => state.comment
  );

  // 컴포넌트가 마운트되거나 questionId가 변경될 때 답변을 불러옵니다.
  useEffect(() => {
    if (questionId) {
      dispatch(fetchCommentsByQuestionId({ questionId }));
    }
    // 컴포넌트가 언마운트될 때 상태를 초기화합니다.
    /* return () => {
      dispatch(clearComments());
    }; */
  }, [questionId]);

  const renderContent = () => {
    if (status === "loading") {
      return (
        <>
          <QuestionDetailSkeleton />
          <QuestionDetailSkeleton />
        </>
      );
    }

    if (status === "failed") {
      return <ErrorMessage>답변을 불러오는 데 실패했습니다.</ErrorMessage>;
    }

    if (status === "succeeded" && comments.length === 0) {
      return (
        <EmptyMessage>
          아직 등록된 답변이 없습니다. 첫 번째 답변을 남겨보세요!
        </EmptyMessage>
      );
    }

    if (status === "succeeded" && comments.length > 0) {
      return (
        <CommentsList>
          {comments.map((comment) => {
            // API 응답 데이터를 AnswerDisplay 컴포넌트의 props에 맞게 매핑합니다.
            const answerData = {
              author: {
                name: comment.userInfoDto.userName,
                profileImage: comment.userInfoDto.profileImgUrl,
              },
              isAuthor: comment.author,
              commentId: comment.commentId,
              createdAt: comment.updateAt,
              content: comment.commentContent,
              likeStatus: comment.likeStatus,
              likeCount: comment.likeCount,
              adopt: comment.adopt,
            };
            return (
              <AnswerDisplay key={comment.commentId} answerData={answerData} />
            );
          })}
        </CommentsList>
      );
    }

    return null;
  };

  return (
    <CommentsContainer>
      <CommentsHeader>답변 {pagination.totalElements || 0}개</CommentsHeader>
      {renderContent()}
    </CommentsContainer>
  );
}

export default CommentSection;
