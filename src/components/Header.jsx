"use client";

import React, { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/slices/themeSlice";
import { logoutUser } from "../redux/slices/userSlice"; // 로그아웃 액션
import { useRouter } from "next/navigation";

// 아이콘 라이브러리
import {
  FaFeatherAlt,
  FaSearch,
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaTrophy, // 랭킹 아이콘
  FaSignOutAlt, // 로그아웃 아이콘
} from "react-icons/fa";

import UserProfile from "../components/common/UserProfile"; // UserProfile 컴포넌트
import gorae from "../assets/logo/gorae.svg";

// =============================================================================
// 🎨 Styled Components
// =============================================================================

const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.bg_page};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding: 0 2rem;
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background-color 0.3s, border-color 0.3s;
  @media (max-width: 768px) {
    padding: 0 1rem;
    height: 64px;
  }
`;

const LogoLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 1.25rem;
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  transition: background-color 0.2s ease-in-out;

  .logo-image {
    transition: transform 0.3s ease-in-out;
  }

  &:hover {
    background-color: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
    .logo-image {
      transform: scaleX(-1);
    }
  }
`;

const NavContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 1024px) {
    display: none; // 모바일 및 태블릿에서는 숨깁니다.
  }
`;

const NavButton = styled(Link)`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.text_secondary};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text};
  }
`;
const NonNavButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.text_secondary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text};
  }
`;
const AskButton = styled(Link)`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: ${({ theme }) => theme.font.weight.bold};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 1024px) {
    display: flex;
  }
`;

const MobileNav = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background-color: ${({ theme }) => theme.bg_page};
  box-shadow: ${({ theme }) => theme.utils.shadow_lg};
  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding: 4rem 2rem;
  gap: 1.5rem;
  transform: ${({ isOpen }) => (isOpen ? "translateX(0)" : "translateX(100%)")};
  transition: transform 0.3s ease-in-out;

  .close-button {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 1.8rem;
  }
`;

// =============================================================================
// 📖 Header Component
// =============================================================================

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  // Redux 스토어에서 로그인 상태와 사용자 정보를 가져옵니다.
  const { isLoggedIn, userName, profileImage } = useSelector(
    (state) => state.user
  );
  const themeMode = useSelector((state) => state.theme.mode);

  const handleToggleTheme = () => dispatch(toggleTheme());
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/login"); // 로그아웃 후 메인 페이지로 이동
  };

  const LoggedOutMenu = () => (
    <NavContainer>
      <NavButton href="/login">로그인</NavButton>
      <NavButton href="/register">회원가입</NavButton>
      <NonNavButton onClick={handleToggleTheme}>
        {themeMode === "light" ? <FaMoon /> : <FaSun />}
      </NonNavButton>
    </NavContainer>
  );

  const LoggedInMenu = () => (
    <NavContainer>
      <AskButton href="/ask">
        <FaFeatherAlt /> 질문하기
      </AskButton>
      <NavButton href="/view">
        <FaSearch /> 질문검색
      </NavButton>
      <NavButton href="/ranking">
        <FaTrophy /> 랭킹
      </NavButton>
      <NonNavButton onClick={handleLogout}>
        <FaSignOutAlt /> 로그아웃
      </NonNavButton>
      <NonNavButton onClick={handleToggleTheme}>
        {themeMode === "light" ? <FaMoon /> : <FaSun />}
      </NonNavButton>

      <UserProfile
        onClick={() => (window.location.href = "/my-page")}
        name={userName}
        profileImage={profileImage}
      />
    </NavContainer>
  );

  return (
    <>
      <HeaderContainer>
        <LogoLink href="/view">
          <Image
            src={gorae}
            alt="고래 로고"
            width={70}
            height={55}
            className="logo-image"
            priority
          />
          <span>지식의 바다</span>
        </LogoLink>

        {isLoggedIn ? <LoggedInMenu /> : <LoggedOutMenu />}

        <MobileMenuButton onClick={toggleMobileMenu}>
          <FaBars />
        </MobileMenuButton>
      </HeaderContainer>

      <MobileNav isOpen={isMobileMenuOpen}>
        <MobileMenuButton className="close-button" onClick={toggleMobileMenu}>
          <FaTimes />
        </MobileMenuButton>
        {isLoggedIn ? (
          <>
            <UserProfile name={userName} profileImage={profileImage} />
            <AskButton href="/ask" onClick={toggleMobileMenu}>
              <FaFeatherAlt /> 질문하기
            </AskButton>
            <NavButton href="/search" onClick={toggleMobileMenu}>
              <FaSearch /> 질문검색
            </NavButton>
            <NavButton href="/ranking" onClick={toggleMobileMenu}>
              <FaTrophy /> 랭킹
            </NavButton>
            <NonNavButton onClick={handleLogout}>
              <FaSignOutAlt /> 로그아웃
            </NonNavButton>
            <NonNavButton onClick={handleToggleTheme}>
              {themeMode === "light" ? <FaMoon /> : <FaSun />}
            </NonNavButton>
          </>
        ) : (
          <>
            <NavButton href="/login" onClick={toggleMobileMenu}>
              로그인
            </NavButton>
            <NavButton href="/register" onClick={toggleMobileMenu}>
              회원가입
            </NavButton>
            <NonNavButton onClick={handleToggleTheme}>
              {themeMode === "light" ? <FaMoon /> : <FaSun />}
            </NonNavButton>
          </>
        )}
      </MobileNav>
    </>
  );
}

export default Header;
