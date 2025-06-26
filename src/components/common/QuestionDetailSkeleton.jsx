"use client";

import React from "react";
import styled, { keyframes } from "styled-components";

// =============================================================================
// 🎨 Styled Components
// =============================================================================

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const SkeletonWrapper = styled.div`
  padding-top: 2rem;
`;

const SkeletonElement = styled.div`
  background-color: ${({ theme }) => theme.bg};
  background-image: linear-gradient(
    to right,
    ${({ theme }) => theme.bg} 0%,
    ${({ theme }) => theme.border} 20%,
    ${({ theme }) => theme.bg} 40%,
    ${({ theme }) => theme.bg} 100%
  );
  background-repeat: no-repeat;
  background-size: 2000px 100%;
  border-radius: 8px;
  animation: ${shimmer} 2s linear infinite;
`;

const SkeletonHeader = styled.div`
  margin-bottom: 3rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const SkeletonTitle = styled(SkeletonElement)`
  height: 40px;
  width: 70%;
  margin-bottom: 1rem;
`;

const SkeletonAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SkeletonAvatar = styled(SkeletonElement)`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`;

const SkeletonAuthorName = styled(SkeletonElement)`
  height: 20px;
  width: 120px;
`;

const SkeletonContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SkeletonLine = styled(SkeletonElement)`
  height: 16px;
  width: ${({ width = "100%" }) => width};
`;

// =============================================================================
// 📖 스켈레톤 UI 컴포넌트
// =============================================================================

function QuestionDetailSkeleton() {
  return (
    <SkeletonWrapper>
      <SkeletonHeader>
        <SkeletonTitle />
        <SkeletonAuthor>
          <SkeletonAvatar />
          <SkeletonAuthorName />
        </SkeletonAuthor>
      </SkeletonHeader>
      <SkeletonContent>
        <SkeletonLine />
        <SkeletonLine width="80%" />
        <SkeletonLine />
        <SkeletonLine width="90%" />
        <SkeletonLine width="60%" />
      </SkeletonContent>
    </SkeletonWrapper>
  );
}

export default QuestionDetailSkeleton;
