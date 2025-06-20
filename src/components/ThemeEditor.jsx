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

// 이 경로는 실제 프로젝트 구조에 맞게 조정해야 합니다.
import {
  editorHeaderPlaceholders,
  getRandomItem,
} from "../assets/RandomPhrases";
const EditorWrapper = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.bg_page};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.utils.shadow_sm};
  transition: background-color 0.3s, border-color 0.3s;
  min-height: 50vh;
  @media (max-width: 768px) {
    padding: 0.75rem;
  }

  .codex-editor__redactor {
    padding-top: 1.5rem !important;
  }

  /* ... 다른 내부 요소 스타일 ... */
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
      /* 호버 시 배경색이 유지되도록 수정했습니다. */
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

const ThemedEditor = ({ editorRef, bodyPlaceholder }) => {
  const [headerPlaceholder, setHeaderPlaceholder] = useState("");

  useEffect(() => {
    // getRandomItem을 한 번만 호출하도록 수정했습니다.
    setHeaderPlaceholder(getRandomItem(editorHeaderPlaceholders));
  }, []);

  useEffect(() => {
    // Editor.js가 중복으로 생성되는 것을 방지합니다.
    if (editorRef.current) {
      return;
    }

    // Placeholder들이 모두 준비된 후에 Editor.js를 생성합니다.
    if (bodyPlaceholder && headerPlaceholder) {
      const editor = new EditorJS({
        holder: "editorjs-container",
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
            config: {
              placeholder: headerPlaceholder,
            },
          },
          list: { class: List, inlineToolbar: true },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                uploadByFile(file) {
                  return new Promise((resolve) => {
                    setTimeout(() => {
                      const temporaryUrl = URL.createObjectURL(file);
                      resolve({ success: 1, file: { url: temporaryUrl } });
                    }, 1000);
                  });
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
        data: {},
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
  }, [editorRef, headerPlaceholder, bodyPlaceholder]);

  return <EditorWrapper id="editorjs-container" />;
};

export default ThemedEditor;
