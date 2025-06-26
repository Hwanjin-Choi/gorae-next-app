"use client";

import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "@/redux/slices/userSlice";

// =============================================================================
// 🎨 Styled Components
// =============================================================================

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
`;

const LoginForm = styled.form`
  width: 100%;
  max-width: 500px;
  padding: 2.5rem;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.bg_page};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.utils.shadow_lg};
`;

const Title = styled.h1`
  ${({ theme }) => theme.typography.h2};
  text-align: center;
  margin-bottom: 2rem;
`;

const ProfileImageUploader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const ProfilePreview = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  background-color: ${({ theme }) => theme.bg};
  border: 3px solid ${({ theme }) => theme.border};
  overflow: hidden;

  &:hover .overlay {
    opacity: 1;
  }
`;

const ImagePreview = styled(Image)`
  object-fit: cover;
`;

const UploadOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  border-radius: 50%;
  text-align: center;
  font-size: 0.8rem;
`;

const HiddenInput = styled.input`
  display: none;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.text_secondary};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: none;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  font-size: 1.1rem;
  font-weight: ${({ theme }) => theme.font.weight.bold};
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.text_subtle};
    cursor: not-allowed;
  }
`;

// =============================================================================
// 📖 회원가입 페이지
// =============================================================================

export default function RegisterPage() {
  const dispatch = useDispatch();

  const router = useRouter();
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log(formData);
      dispatch(loginUser(formData));
      router.push("/view");
    } catch (error) {
      console.error("회원가입 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <Title>지식의 바다로</Title>
        <InputGroup>
          <Label htmlFor="userId">아이디</Label>
          <Input
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </InputGroup>

        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? "로그인 중..." : "로그인"}
        </SubmitButton>
      </LoginForm>
    </LoginContainer>
  );
}
