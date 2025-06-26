"use client";

import React, { useState, useRef } from "react";
import styled from "styled-components";
import { FaUserPlus, FaCamera } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import apiClient from "../../api";
import axios from "axios";

// =============================================================================
// 🎨 Styled Components
// =============================================================================

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
`;

const RegisterForm = styled.form`
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
  const router = useRouter();
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    userName: "",
    phoneNumber: "",
    email: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const submissionData = new FormData();

    // registerData를 JSON 문자열로 만들고, application/json 타입의 Blob으로 감쌉니다.
    const registerDataBlob = new Blob([JSON.stringify(formData)], {
      type: "application/json",
    });
    submissionData.append("registerData", registerDataBlob);

    if (profileImage) {
      submissionData.append("profileImage", profileImage);
    }

    try {
      /* await apiClient.post("/user/v1/auth/register", submissionData, {
        headers: {
          Authorization: undefined,
        },
      }); */
      await axios.post(
        "http://localhost:8080/api/user/v1/auth/register", // 포트 번호를 8080으로 변경
        submissionData
      );

      alert(
        "회원가입이 성공적으로 완료되었습니다. 로그인 페이지로 이동합니다."
      );
      router.push("/login");
    } catch (error) {
      console.error("회원가입 실패:", error);
      // 서버에서 구체적인 에러 메시지를 보냈다면, 그것을 보여주는 것이 좋습니다.
      const errorMessage =
        error.response?.data?.message ||
        "회원가입에 실패하였습니다. 다시 시도해주십시오.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterForm onSubmit={handleSubmit}>
        <Title>새로운 지성 맞이하기</Title>

        <ProfileImageUploader>
          <HiddenInput
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <ProfilePreview onClick={() => fileInputRef.current.click()}>
            {preview ? (
              <ImagePreview src={preview} alt="프로필 미리보기" layout="fill" />
            ) : (
              <FaUserPlus
                size={40}
                color="gray"
                style={{
                  margin: "auto",
                  display: "block",
                  position: "relative",
                  top: "30%",
                }}
              />
            )}
            <UploadOverlay className="overlay">
              <FaCamera />
              <span>이미지 변경</span>
            </UploadOverlay>
          </ProfilePreview>
        </ProfileImageUploader>

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

        <InputGroup>
          <Label htmlFor="userName">닉네임</Label>
          <Input
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            required
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="phoneNumber">전화번호</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </InputGroup>

        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? "등록 중..." : "회원가입"}
        </SubmitButton>
      </RegisterForm>
    </RegisterContainer>
  );
}
