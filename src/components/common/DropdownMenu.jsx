"use client";

import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { FaEllipsisV } from "react-icons/fa";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const TriggerButton = styled.button`
  background: none;
  border: 1px solid transparent;
  border-radius: 50%;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  transition: background-color 0.2s, color 0.2s;

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.bg_component};
    color: ${({ theme }) => theme.text};
    outline: none;
  }
`;

const Menu = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  background-color: ${({ theme }) => theme.bg_page};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.utils.shadow_lg};
  z-index: 100;
  width: 160px;
  overflow: hidden;
  animation: ${fadeIn} 0.2s ease-out;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  color: ${({ theme, isDelete }) => (isDelete ? theme.error : theme.text)};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.bg_component};
    color: ${({ theme, isDelete }) => (isDelete ? theme.error : theme.primary)};
  }

  svg {
    color: ${({ theme, isDelete }) =>
      isDelete ? theme.error : theme.text_secondary};
  }

  &:hover svg {
    color: ${({ theme, isDelete }) => (isDelete ? theme.error : theme.primary)};
  }
`;

/**
 * Dropdown Menu Component
 * @param {Array} options - 메뉴 옵션 배열 { label, icon, onClick, isDelete }
 */
const DropdownMenu = ({ options = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <DropdownContainer ref={dropdownRef}>
      <TriggerButton
        onClick={toggleMenu}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <FaEllipsisV />
      </TriggerButton>
      {isOpen && (
        <Menu role="menu">
          {options.map((option, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                option.onClick();
                setIsOpen(false);
              }}
              role="menuitem"
              isDelete={option.isDelete}
            >
              {option.icon}
              <span>{option.label}</span>
            </MenuItem>
          ))}
        </Menu>
      )}
    </DropdownContainer>
  );
};

export default DropdownMenu;
