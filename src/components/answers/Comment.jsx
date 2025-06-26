"use client";

import React from "react";
import styled from "styled-components";
import AnswerDisplay from "./AnswerDisplay"; // 새로 만든 답변 컴포넌트를 가져옵니다.

// 이 페이지는 질문 본문과 여러 개의 답변 목록을 보여주는 역할을 합니다.
const QuestionDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem; /* 답변과 답변 사이의 간격 */
`;

const AnswerSection = styled.section`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 3px solid ${({ theme }) => theme.border};
`;

const AnswerCount = styled.h2`
  ${({ theme }) => theme.typography.h2};
  margin-bottom: 1.5rem;
`;

function QuestionDetailPageExample() {
  // 실제로는 서버에서 가져올 질문과 답변 데이터
  const questionTitle = "Next.js에서 Editor.js 렌더링하기";

  const answers = [
    {
      id: 1,
      author: {
        name: "지혜로운 답변가",
        profileImage: "https://placehold.co/80x80/60A5FA/FFFFFF?text=G",
        medals: {
          likes: { level: 3, name: "따스한 온기" },
          adoption: { level: 4, name: "황금 독수리장" },
        },
      },
      createdAt: "2025-06-20T17:30:00Z",
      content: {
        blocks: [
          {
            id: "h1",
            type: "header",
            data: { text: "넘 존맛탱이에요", level: 3 },
          },
        ],
      },
    },
    {
      id: 2,
      author: {
        name: "신속한 해결사",
        profileImage: "https://placehold.co/80x80/F59E0B/FFFFFF?text=S",
        medals: {
          likes: { level: 1, name: "작은 관심" },
        },
      },
      createdAt: "2025-06-20T18:00:00Z",
      content: {
        blocks: [
          {
            id: "h1",
            type: "header",
            data: { text: "헤더 1: 가장 큰 제목입니다.", level: 1 },
          },
          {
            id: "p1",
            type: "paragraph",
            data: {
              text: "이곳은 일반적인 문단입니다. <b>굵은 글씨</b>와 <mark>하이라이트</mark>를 지원합니다.",
            },
          },
          {
            id: "q1",
            type: "quote",
            data: {
              text: "위대한 발견은 작은 호기심에서 비롯되옵니다.",
              caption: "익명의 현자",
            },
          },
          {
            id: "ul1",
            type: "list",
            data: {
              style: "unordered",
              items: ["첫 번째 항목", "두 번째 항목"],
            },
          },
          {
            id: "cl1",
            type: "checklist",
            data: {
              items: [
                { text: "완료된 항목", checked: true },
                { text: "해야 할 항목", checked: false },
              ],
            },
          },
          {
            id: "h2",
            type: "header",
            data: { text: "헤더 2: 코드와 이미지", level: 2 },
          },
          {
            id: "c1",
            type: "code",
            data: { code: 'const a = "Hello, World!";\nconsole.log(a);' },
          },
          {
            id: "img1",
            type: "image",
            data: {
              file: {
                url: "https://placehold.co/600x400/3B82F6/white?text=Gorae",
              },
              caption: "고래 이미지 예시",
            },
          },
          {
            id: "h3",
            type: "header",
            data: { text: "헤더 3: 표와 임베드", level: 3 },
          },
        ],
      },
    },
  ];

  return (
    <div>
      {/* 이 부분에는 질문 본문을 표시하는 컴포넌트가 위치하게 될 것입니다. */}

      <AnswerSection>
        <AnswerCount>답변 {answers.length}개</AnswerCount>
        <QuestionDetailContainer>
          {answers.map((answer) => (
            <AnswerDisplay key={answer.id} answerData={answer} />
          ))}
        </QuestionDetailContainer>
      </AnswerSection>
    </div>
  );
}

export default QuestionDetailPageExample;
