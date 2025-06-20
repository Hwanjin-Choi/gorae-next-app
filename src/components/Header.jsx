import React, { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/slices/themeSlice";
import Image from "next/image";
// react-icons 라이브러리를 사용하여 아이콘을 가져옵니다.
import {
  FaFeatherAlt,
  FaSearch,
  FaUserCircle,
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
} from "react-icons/fa";

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
  border-radius: 8px;
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  transition: background-color 0.2s ease-in-out;

  .logo-image {
    transition: transform 0.3s ease-in-out;
  }
  img {
    height: 55px;
    width: 70px;
    transition: transform 0.3s ease-in-out; // 이미지 전환 효과
    @media (max-width: 768px) {
      height: 32px;
      width: 50px;
    }
  }

  /* 마우스를 올렸을 때의 스타일 변화 */
  &:hover {
    background-color: ${({ theme }) => theme.bg}; // 은은한 배경색 추가
    color: ${({ theme }) => theme.primary}; // 텍스트 색상 변경
    text-decoration: none;
    img {
      transform: scaleX(-1); // 이미지를 좌우로 반전시킵니다.
    }
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    display: none; // 모바일에서는 숨깁니다.
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    display: none; // 모바일에서는 숨깁니다.
  }
`;

const AskButton = styled(Link)`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    opacity: 0.9;
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const MobileMenuButton = styled(IconButton)`
  display: none;
  font-size: 1.5rem;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileNav = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.bg_page};
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  transform: ${({ isOpen }) => (isOpen ? "translateX(0)" : "translateX(100%)")};
  transition: transform 0.3s ease-in-out;

  .close-button {
    position: absolute;
    top: 20px;
    right: 32px;
  }
`;

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.mode);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const DesktopMenu = () => (
    <>
      <Nav>{/* 네비게이션 메뉴 (추후 확장 가능) */}</Nav>
      <ActionsContainer>
        <AskButton href="/ask">
          <FaFeatherAlt />
          질문하기
        </AskButton>
        <IconButton>
          <FaSearch />
        </IconButton>
        <IconButton onClick={handleToggleTheme}>
          {themeMode === "light" ? <FaMoon /> : <FaSun />}
        </IconButton>
        <IconButton>
          <FaUserCircle />
        </IconButton>
      </ActionsContainer>
    </>
  );

  return (
    <>
      <HeaderContainer>
        <LogoLink href="/">
          {/* 전하의 요청에 맞춰 img 태그를 사용합니다. */}
          <Image
            src={gorae}
            alt="고래 로고"
            width={32}
            height={32}
            className="logo-image"
          />
          <span>지식의 바다 </span>
        </LogoLink>
        <DesktopMenu />
        <MobileMenuButton onClick={toggleMobileMenu}>
          <FaBars />
        </MobileMenuButton>
      </HeaderContainer>

      <MobileNav isOpen={isMobileMenuOpen}>
        <MobileMenuButton className="close-button" onClick={toggleMobileMenu}>
          <FaTimes />
        </MobileMenuButton>
        <AskButton href="/ask" onClick={toggleMobileMenu}>
          <FaFeatherAlt />
          질문하기
        </AskButton>
        <IconButton>
          <FaSearch />
        </IconButton>
        <IconButton onClick={handleToggleTheme}>
          {themeMode === "light" ? <FaMoon /> : <FaSun />}
        </IconButton>
        <IconButton>
          <FaUserCircle />
        </IconButton>
      </MobileNav>
    </>
  );
}

export default Header;
