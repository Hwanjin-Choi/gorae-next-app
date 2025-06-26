"use client";

import React from "react";
import styled from "styled-components";
import Image from "next/image";
import { likeMedals, adoptionMedals } from "@/assets/medalData";
import defaultPic from "@/assets/profile.png";
// =============================================================================
// 🎨 Styled Components
// =============================================================================

const Tooltip = styled.span`
  position: absolute;
  bottom: 150%;
  left: 50%;
  transform: translateX(-50%);

  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: ${({ theme }) => theme.font.weight.medium};
  box-shadow: ${({ theme }) => theme.utils.shadow_md};

  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s, visibility 0.2s;
  z-index: 10;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: ${({ theme }) => theme.bg} transparent transparent transparent;
  }
`;

const IconContainer = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease-in-out;
`;

const MedalWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: ${({ theme, colorkey }) => theme[colorkey] || theme.text_secondary};
  cursor: help;

  &:hover ${IconContainer} {
    transform: scale(1.25);
  }

  &:hover ${Tooltip} {
    visibility: visible;
    opacity: 1;
  }
`;

const UserProfileContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 9999px;
  /* 수정된 부분: 테마에 맞는 새로운 컴포넌트 배경색 적용 */
  background-color: ${({ theme }) => theme.bg_component};
  transition: background-color 0.2s;

  &:hover {
    /* 호버 시에는 기존 border 색상을 사용하여 대비를 줌 */
    background-color: ${({ theme }) => theme.border};
  }
`;

const ProfileImage = styled(Image)`
  border-radius: 50%;
  width: 32px;
  height: 32px;
`;

const UserName = styled.span`
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;
`;

const MedalsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// =============================================================================
// 📖 User Profile Component
// =============================================================================

const UserProfile = ({ name, profileImage, likeLevel, adoptionLevel }) => {
  const likeMedal = likeMedals.find((m) => m.level === likeLevel);
  const adoptionMedal = adoptionMedals.find((m) => m.level === adoptionLevel);

  return (
    <UserProfileContainer>
      <ProfileImage
        src={profileImage ? profileImage : defaultPic}
        alt={`${name}의 프로필 사진`}
        width={32}
        height={32}
        unoptimized
      />
      <UserName>{name}</UserName>
      <MedalsContainer>
        {adoptionMedal && (
          <MedalWrapper colorkey={adoptionMedal.color}>
            <IconContainer>
              <adoptionMedal.Icon />
            </IconContainer>
            <Tooltip>{adoptionMedal.name}</Tooltip>
          </MedalWrapper>
        )}
        {likeMedal && (
          <MedalWrapper colorkey={likeMedal.color}>
            <IconContainer>
              <likeMedal.Icon />
            </IconContainer>
            <Tooltip>{likeMedal.name}</Tooltip>
          </MedalWrapper>
        )}
      </MedalsContainer>
    </UserProfileContainer>
  );
};

export default UserProfile;
