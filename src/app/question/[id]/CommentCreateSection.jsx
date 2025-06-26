"use client";

import React, { useRef, useState } from "react";
import styled from "styled-components";
import ThemedEditor from "@/components/ThemeEditor";
import { useModal } from "@/context/ModalContext";
import { FaPaperPlane, FaTimes } from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import { createComment } from "@/redux/slices/commentSlice";
import { useSelector, useDispatch } from "react-redux";
const FormContainer = styled.div`
  margin-top: 2rem;
  position: relative;
  padding-bottom: 5rem; /* 버튼들을 위한 여유 공간 확보 */
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const FormButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: ${({ theme }) => theme.font.weight.bold};
  border-radius: 8px;
  padding: 0.65rem 1.25rem;
  cursor: pointer;
  border: 1px solid
    ${({ theme, primary }) => (primary ? "transparent" : theme.border)};
  background-color: ${({ theme, primary }) =>
    primary ? theme.primary : theme.bg_page};
  color: ${({ theme, primary }) => (primary ? "white" : theme.text)};
  box-shadow: ${({ theme }) => theme.utils.shadow_sm};
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.utils.shadow_md};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.text_subtle};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

/**
 * @param {object} props
 * @param {() => void} props.onClose - 폼을 닫는 함수
 */
const AnswerForm = ({ onClose }) => {
  const editorRef = useRef(null);
  const params = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const dispatch = useDispatch();
  const { openModal } = useModal();

  const handleAnswerSubmit = async () => {
    if (!editorRef.current) return;
    const answerData = await editorRef.current.save();
    if (answerData.blocks.length === 0) {
      openModal({ title: "내용 부족", message: "답변 내용을 입력해주세요." });
      return;
    }

    const body = {
      questionId: params.id,
      commentContent: answerData,
    };

    console.log(body);

    dispatch(createComment(body))
      .unwrap()
      .then(() => {
        openModal({
          title: "생성 완료!",
          message: "질문 답변이 성공적으로 수정되었습니다.",
          onConfirm: () => {
            window.location.reload();
          },
        });
      })
      .catch((err) => {
        alert(`생성에 실패했습니다: ${err.message}`);
      });

    /* openModal({
      title: "답변 등록 완료!",
      message: "소중한 지식을 나눠주셔서 감사합니다.",
      onConfirm: () => window.location.reload(),
    }); */
  };

  return (
    <FormContainer>
      <ThemedEditor
        editorRef={editorRef}
        bodyPlaceholder="작성자는 답변을 기다릴꺼에요"
        editorType="answer"
        holderId="answer-editor-form"
      />
      <ButtonContainer>
        <FormButton onClick={onClose}>
          <FaTimes /> 취소
        </FormButton>
        <FormButton primary onClick={handleAnswerSubmit}>
          <FaPaperPlane /> 답변 등록
        </FormButton>
      </ButtonContainer>
    </FormContainer>
  );
};

export default AnswerForm;
