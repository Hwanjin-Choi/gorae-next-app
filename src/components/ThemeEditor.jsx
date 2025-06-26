// src/components/ThemeEditor.jsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import CodeTool from "@editorjs/code";
import Table from "@editorjs/table";
import Checklist from "@editorjs/checklist";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import Embed from "@editorjs/embed";
import {
  editorHeaderPlaceholders,
  getRandomItem,
} from "../assets/RandomPhrases";
import apiClient from "@/api";

const EditorWrapper = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.bg_page};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.utils.shadow_sm};
  transition: background-color 0.3s, border-color 0.3s;

  min-height: ${({ editorType }) =>
    editorType === "answer" ? "25vh" : "50vh"};

  @media (max-width: 768px) {
    padding: 0.75rem;
    min-height: ${({ editorType }) =>
      editorType === "answer" ? "10vh" : "40vh"};
  }

  .codex-editor__redactor {
    padding-top: 1.5rem !important;
    padding-bottom: 100px !important;
  }

  .ce-block__content,
  .ce-toolbar__content {
    max-width: 90%;
    color: ${({ theme }) => theme.text};
    @media (max-width: 768px) {
      max-width: 100%;
    }
  }

  .ce-toolbar__plus,
  .ce-toolbar__settings-btn {
    background-color: ${({ theme }) => theme.text};
    color: ${({ theme }) => theme.bg_page};
    border-radius: 6px;
    transition: all 0.2s ease-in-out;

    &:hover {
      transform: scale(1.1);
      background-color: ${({ theme }) => theme.text};
    }

    svg {
      fill: currentColor;
    }
  }

  .ce-header {
    color: ${({ theme }) => theme.text};
    font-weight: ${({ theme }) => theme.font.weight.bold};
  }

  .ce-placeholder {
    color: ${({ theme }) => theme.text_secondary};
  }

  .ce-quote {
    background-color: ${({ theme }) => theme.bg};
    border-left: 3px solid ${({ theme }) => theme.primary};
    padding: 1rem;
    border-radius: 4px;
  }

  .ce-code {
    background-color: ${({ theme }) => theme.bg};
    padding: 1rem;
    border-radius: 4px;
  }

  .ce-popover,
  .ce-toolbox,
  .ce-inline-toolbar {
    background-color: ${({ theme }) => theme.bg_page};
    border: 1px solid ${({ theme }) => theme.border};
    box-shadow: ${({ theme }) => theme.utils.shadow_lg};
    color: ${({ theme }) => theme.text};
  }

  .ce-popover__item-icon,
  .ce-toolbox__button,
  .ce-inline-tool {
    color: ${({ theme }) => theme.text_secondary};
    &:hover {
      background-color: ${({ theme }) => theme.bg};
      color: ${({ theme }) => theme.primary};
    }
  }
`;

const ThemedEditor = ({
  editorRef,
  bodyPlaceholder,
  initialData,
  editorType,
  holderId = "editorjs-container",
}) => {
  const [headerPlaceholder, setHeaderPlaceholder] = useState("");

  useEffect(() => {
    setHeaderPlaceholder(getRandomItem(editorHeaderPlaceholders));
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      return;
    }

    if (headerPlaceholder && document.getElementById(holderId)) {
      const editor = new EditorJS({
        holder: holderId,
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
            config: {
              placeholder:
                editorType === "question"
                  ? headerPlaceholder
                  : "답변의 핵심 내용을 요약해주세요.",
            },
          },
          list: { class: List, inlineToolbar: true },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file) {
                  const formData = new FormData();
                  formData.append("image", file); // API 명세와 동일한 'image' 키를 사용합니다.

                  try {
                    // 1. API 엔드포인트를 명세에 맞게 수정합니다.
                    const response = await apiClient.post(
                      "/post/v1/image", // 수정된 엔드포인트
                      formData,
                      {
                        headers: {
                          "Content-Type": "multipart/form-data",
                        },
                      }
                    );

                    // 2. 서버 응답 구조에 맞게 URL을 추출합니다.
                    if (response.data && response.data.data) {
                      return {
                        success: 1,
                        file: {
                          url: response.data.data, // response.data.data에 URL이 담겨있습니다.
                        },
                      };
                    } else {
                      console.error(
                        "업로드 성공했으나, 응답에 URL이 없습니다."
                      );
                      return { success: 0 };
                    }
                  } catch (error) {
                    console.error("이미지 업로드에 실패했습니다:", error);
                    return { success: 0 };
                  }
                },
              },
            },
          },
          code: CodeTool,
          table: Table,
          checklist: Checklist,
          quote: Quote,
          marker: Marker,
          embed: Embed,
        },
        data: initialData || {},
        placeholder: bodyPlaceholder,
      });
      editorRef.current = editor;
    }

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [
    editorRef,
    headerPlaceholder,
    bodyPlaceholder,
    initialData,
    editorType,
    holderId,
  ]);

  return <EditorWrapper id={holderId} editorType={editorType} />;
};

export default ThemedEditor;
