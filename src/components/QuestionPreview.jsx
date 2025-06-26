// src/components/QuestionPreview.jsx
"use client";

import { useRouter } from "next/navigation";
import styled from "styled-components";
import UserProfile from "@/components/common/UserProfile";

const QuestionPreview = ({ question }) => {
  const router = useRouter();
  const { questionId, title, writer } = question;

  const handleNavigate = () => {
    router.push(`/question/${questionId}`);
  };

  return (
    <PreviewContainer onClick={handleNavigate}>
      <Title>{title || "제목이 없는 질문입니다."}</Title>
      <InfoContainer>
        {/* <Writer>{writer?.nickname || "작성자"}</Writer> */}
        <UserProfile
          name={question.userInfoDto?.userName || "사용자"}
          profileImage={question.userInfoDto?.profileImgUrl}
          likeLevel={Number(question.userInfoDto?.likeBadge || 1)}
          adoptionLevel={Number(question.userInfoDto?.userBadge || 1)}
        />
        <Stats>
          <span>조회 {question.viewCount}</span>
          <span>답변 {question.commentCount}</span>
        </Stats>
      </InfoContainer>
    </PreviewContainer>
  );
};

// 전하의 테마를 온전히 사용하여 스타일을 구성합니다.
const PreviewContainer = styled.div`
  background-color: ${({ theme }) => theme.bg_page};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  box-shadow: ${({ theme }) => theme.utils.shadow_sm};

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.utils.shadow_md};
  }
`;
const Title = styled.h3`
  margin: 0 0 0.75rem 0;
  color: ${({ theme }) => theme.text};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
`;
const InfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.font.size.caption};
  color: ${({ theme }) => theme.text_secondary};
`;
const Writer = styled.span`
  font-weight: ${({ theme }) => theme.font.weight.medium};
`;
const Stats = styled.div`
  span {
    margin-left: 1.25rem;
  }
`;

export default QuestionPreview;
