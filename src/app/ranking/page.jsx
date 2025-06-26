"use client";

import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLikesRanking,
  fetchSelectedRanking,
  fetchSelectedRateRanking,
} from "../../redux/slices/leaderboardSlice";

import { likeMedals, adoptionMedals } from "../../assets/medalData";
import UserProfile from "../../components/common/UserProfile"; // 기존 UserProfile 컴포넌트 재활용
import { FaCrown } from "react-icons/fa";

// =============================================================================
// 🎨 Styled Components
// =============================================================================

const RankingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const Title = styled.h1`
  ${({ theme }) => theme.typography.h1};
  text-align: center;
  margin-bottom: 1rem;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${({ theme }) => theme.border};
`;

const TabButton = styled.button`
  padding: 1rem 1.5rem;
  border: none;
  background: none;
  font-size: 1.1rem;
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme, active }) =>
    active ? theme.primary : theme.text_secondary};
  cursor: pointer;
  position: relative;
  transition: color 0.2s;

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${({ theme }) => theme.primary};
    transform: ${({ active }) => (active ? "scaleX(1)" : "scaleX(0)")};
    transition: transform 0.3s ease-in-out;
  }
`;

const RankingList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RankItem = styled.li`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.bg_page};
  border: 1px solid ${({ theme }) => theme.border};
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.utils.shadow_md};
  }
`;

const RankNumber = styled.div`
  font-size: 1.5rem;
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.text_secondary};
  width: 40px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ rank }) =>
    rank === 1 &&
    css`
      color: #ffd700;
    `}
  ${({ rank }) =>
    rank === 2 &&
    css`
      color: #c0c0c0;
    `}
  ${({ rank }) =>
    rank === 3 &&
    css`
      color: #cd7f32;
    `}
`;

const RankInfo = styled.div`
  flex-grow: 1;
`;

const RankValue = styled.div`
  margin-left: auto;
  font-size: 1.2rem;
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.primary};
  text-align: right;

  .unit {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.text_secondary};
  }
`;

// =============================================================================
// 📖 랭킹 페이지
// =============================================================================

const RANKING_TABS = [
  {
    key: "likes",
    name: "좋아요 랭킹",
    fetcher: fetchLikesRanking,
    unit: " 개",
  },
  {
    key: "selected",
    name: "채택 수 랭킹",
    fetcher: fetchSelectedRanking,
    unit: " 회",
  },
  {
    key: "selectedRate",
    name: "채택률 랭킹",
    fetcher: fetchSelectedRateRanking,
    unit: "%",
  },
];

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState(RANKING_TABS[0]);
  const dispatch = useDispatch();
  const { rankings, status } = useSelector((state) => state.leaderboard);

  useEffect(() => {
    // 활성화된 탭에 맞는 데이터를 불러옵니다.
    dispatch(activeTab.fetcher());
  }, [activeTab, dispatch]);

  const currentRankingData = rankings[activeTab.key];

  return (
    <RankingContainer>
      <Title>고래의 전당</Title>

      <TabContainer>
        {RANKING_TABS.map((tab) => (
          <TabButton
            key={tab.key}
            active={activeTab.key === tab.key}
            onClick={() => setActiveTab(tab)}
          >
            {tab.name}
          </TabButton>
        ))}
      </TabContainer>

      {status === "loading" && <p>랭킹을 불러오는 중...</p>}
      {status === "succeeded" && (
        <RankingList>
          {currentRankingData.map((user, index) => (
            <RankItem key={user.userId}>
              <RankNumber rank={index + 1}>
                {index < 3 ? <FaCrown /> : index + 1}
              </RankNumber>
              <RankInfo>
                <UserProfile
                  name={user.userName || user.userId}
                  profileImage={user.profileImgUrl}
                  likeLevel={user.likeBadge}
                  adoptionLevel={user.userBadge}
                />
              </RankInfo>
              <RankValue>
                {activeTab.key === "likes" && user.likeCount}
                {activeTab.key === "selected" && user.selectedCount}
                {activeTab.key === "selectedRate" &&
                  user.selectedRate.toFixed(1)}
                <span className="unit">{activeTab.unit}</span>
              </RankValue>
            </RankItem>
          ))}
        </RankingList>
      )}
    </RankingContainer>
  );
}
