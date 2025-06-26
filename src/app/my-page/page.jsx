"use client";

import React, { useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyProfile } from "../../redux/slices/leaderboardSlice";
import { likeMedals, adoptionMedals } from "../../assets/medalData";
import UserProfile from "../../components/common/UserProfile";
import { FaHeart, FaCheck, FaPercentage } from "react-icons/fa";

// =============================================================================
// 🎨 Styled Components
// =============================================================================

const ProfilePageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background-color: ${({ theme }) => theme.bg_page};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
`;

const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
`;

const AchievementCard = styled.div`
  background-color: ${({ theme }) => theme.bg_page};
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
`;

const CardIcon = styled.div`
  font-size: 2rem;
  color: ${({ theme, colorKey }) => theme[colorKey] || theme.primary};
`;

const CardValue = styled.p`
  font-size: 2.5rem;
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const CardLabel = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.text_secondary};
  margin: 0;
`;

// --- 새로운 컴포넌트 스타일 ---

const MedalGuideContainer = styled.section`
  background-color: ${({ theme }) => theme.bg_page};
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid ${({ theme }) => theme.border};
`;

const GuideTitle = styled.h2`
  ${({ theme }) => theme.typography.h2};
  margin-top: 0;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const MedalList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1.5rem;
`;

const MedalInfoCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.bg};
`;

const MedalIcon = styled.div`
  font-size: 2.5rem;
  color: ${({ theme, colorKey }) => theme[colorKey]};
  flex-shrink: 0;
`;

const MedalDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const MedalName = styled.span`
  font-weight: ${({ theme }) => theme.font.weight.bold};
  font-size: 1rem;
  color: ${({ theme }) => theme.text};
`;

const MedalLevel = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.text_secondary};
`;

// =============================================================================
// 🏅 훈장 가이드 컴포넌트
// =============================================================================
const MedalGuide = ({ title, medals, userLevel }) => (
  <MedalGuideContainer>
    <GuideTitle>{title}</GuideTitle>
    <MedalList>
      {medals.map((medal) => (
        <MedalInfoCard key={medal.level}>
          <MedalIcon colorKey={medal.color}>
            <medal.Icon />
          </MedalIcon>
          <MedalDetails>
            <MedalName>{medal.name}</MedalName>
            <MedalLevel>레벨 {medal.level}</MedalLevel>
          </MedalDetails>
        </MedalInfoCard>
      ))}
    </MedalList>
  </MedalGuideContainer>
);

// =============================================================================
// 📖 마이페이지
// =============================================================================

export default function MyProfilePage() {
  const dispatch = useDispatch();
  const { myProfile, myProfileStatus } = useSelector(
    (state) => state.leaderboard
  );

  useEffect(() => {
    // 마운트 시 내 프로필 정보를 불러옵니다.
    dispatch(fetchMyProfile());
  }, [dispatch]);

  if (myProfileStatus === "loading" || myProfileStatus === "idle") {
    return <p>내 정보를 불러오는 중...</p>;
  }

  if (myProfileStatus === "failed" || !myProfile) {
    return <p>정보를 불러오는 데 실패했습니다.</p>;
  }

  return (
    <ProfilePageContainer>
      <ProfileHeader>
        <UserProfile
          name={myProfile.userName || myProfile.userId}
          profileImage={myProfile.profileImgUrl}
          likeLevel={Number(myProfile.likeBadge || 1)}
          adoptionLevel={Number(myProfile.userBadge || 1)}
        />
      </ProfileHeader>

      <AchievementsGrid>
        <AchievementCard>
          <CardIcon colorKey="error">
            <FaHeart />
          </CardIcon>
          <CardValue>{myProfile.likeCount}</CardValue>
          <CardLabel>받은 좋아요</CardLabel>
        </AchievementCard>

        <AchievementCard>
          <CardIcon colorKey="success">
            <FaCheck />
          </CardIcon>
          <CardValue>{myProfile.selectedCount}</CardValue>
          <CardLabel>총 채택 수</CardLabel>
        </AchievementCard>

        <AchievementCard>
          <CardIcon colorKey="primary">
            <FaPercentage />
          </CardIcon>
          <CardValue>{myProfile.selectedRate.toFixed(1)}%</CardValue>
          <CardLabel>채택률</CardLabel>
        </AchievementCard>
      </AchievementsGrid>

      {/* --- 새로 추가된 훈장 가이드 섹션 --- */}
      <MedalGuide
        title="좋아요 등급에는 이런게 있어요!"
        medals={likeMedals}
        userLevel={myProfile.likeBadge}
      />
      <MedalGuide
        title="채택 등급에는 이런게 있어요!"
        medals={adoptionMedals}
        userLevel={myProfile.userBadge}
      />

      {/* 여기에 사용자가 작성한 질문/답변 목록 등을 추가할 수 있습니다. */}
    </ProfilePageContainer>
  );
}
