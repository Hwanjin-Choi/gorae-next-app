"use client";

import React, { useEffect } from "react";
import styled from "styled-components";
import { FaUserCircle, FaCheckSquare } from "react-icons/fa";
import { FiSquare } from "react-icons/fi";

// =============================================================================
// 🎨 Styled Components
// =============================================================================

const ArticleContainer = styled.article`
  padding-top: 2rem;
`;

const QuestionHeader = styled.header`
  margin-bottom: 3rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const QuestionTitle = styled.h1`
  ${({ theme }) => theme.typography.h1};
  margin-bottom: 1rem;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${({ theme }) => theme.text_secondary};
`;

const ContentBody = styled.div`
  line-height: 1.7;

  /* ======================================================= */
  /* 블록 렌더러가 생성할 태그들에 대한 공통 스타일 */
  /* ======================================================= */

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    line-height: 1.3;
  }

  p {
    margin-bottom: 1.5rem;
  }

  ul,
  ol {
    margin-bottom: 1.5rem;
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  /* 인용(Quote) 블록 스타일 */
  blockquote {
    border-left: 4px solid ${({ theme }) => theme.border};
    padding-left: 1rem;
    margin: 2rem 0;
    color: ${({ theme }) => theme.text_secondary};

    footer {
      margin-top: 0.5rem;
      font-style: italic;
    }
  }

  /* 코드(Code) 블록 스타일 */
  pre {
    background-color: ${({ theme }) => theme.bg};
    padding: 1rem;
    border-radius: 8px;
    margin: 2rem 0;
    overflow-x: auto;
  }

  code {
    font-family: "D2Coding", "Consolas", monospace;
  }

  /* 이미지(Image) 블록 스타일 */
  figure {
    margin: 2rem 0;
  }
  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
    border-radius: 8px;
  }
  figcaption {
    text-align: center;
    color: ${({ theme }) => theme.text_subtle};
    font-size: ${({ theme }) => theme.font.size.caption};
    margin-top: 0.5rem;
  }

  /* 마커(Marker) 인라인 스타일 */
  mark {
    background-color: ${({ theme }) =>
      theme.accent}4D; /* 4D는 투명도 30%를 의미합니다. */
    border-radius: 3px;
    padding: 2px 4px;
  }

  /* 체크리스트(Checklist) 블록 스타일 */
  .checklist {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin: 2rem 0;
  }
  .checklist-item {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
  }
  .checklist-item-checked {
    text-decoration: line-through;
    color: ${({ theme }) => theme.text_secondary};
  }
  .checklist-box {
    margin-top: 4px; /* 아이콘과 텍스트의 세로 정렬을 맞춥니다. */
  }

  /* 테이블(Table) 블록 스타일 */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 2rem 0;
    border: 1px solid ${({ theme }) => theme.border};
  }
  th,
  td {
    border: 1px solid ${({ theme }) => theme.border};
    padding: 0.75rem;
    text-align: left;
  }
  thead {
    background-color: ${({ theme }) => theme.bg};
  }
  tbody tr:nth-child(even) {
    background-color: ${({ theme }) => theme.bg};
  }

  /* 임베드(Embed) 블록 스타일 */
  .embed-container {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 비율 */
    height: 0;
    overflow: hidden;
    max-width: 100%;
    background: #000;
    border-radius: 8px;
    margin: 2rem 0;
  }
  .embed-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

// =============================================================================
// 📜 블록 렌더러 (Block Renderer)
// =============================================================================

function BlockRenderer({ blocks }) {
  if (!blocks || blocks.length === 0) {
    return <p>내용이 없사옵니다.</p>;
  }

  return (
    <>
      {blocks.map((block) => {
        switch (block.type) {
          case "header":
            const HeaderTag = `h${block.data.level}`;
            return (
              <HeaderTag
                key={block.id}
                dangerouslySetInnerHTML={{ __html: block.data.text }}
              />
            );

          case "paragraph":
            return (
              <p
                key={block.id}
                dangerouslySetInnerHTML={{ __html: block.data.text }}
              />
            );

          case "list":
            const ListTag = block.data.style === "ordered" ? "ol" : "ul";
            return (
              <ListTag key={block.id}>
                {block.data.items.map((item, index) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ListTag>
            );

          case "image":
            return (
              <figure key={block.id}>
                <img
                  src={block.data.file.url}
                  alt={block.data.caption || "질문 이미지"}
                />
                {block.data.caption && (
                  <figcaption
                    dangerouslySetInnerHTML={{ __html: block.data.caption }}
                  />
                )}
              </figure>
            );

          case "code":
            return (
              <pre key={block.id}>
                <code>{block.data.code}</code>
              </pre>
            );

          case "quote":
            return (
              <blockquote key={block.id}>
                <p dangerouslySetInnerHTML={{ __html: block.data.text }} />
                {block.data.caption && (
                  <footer
                    dangerouslySetInnerHTML={{ __html: block.data.caption }}
                  />
                )}
              </blockquote>
            );

          case "checklist":
            return (
              <div className="checklist" key={block.id}>
                {block.data.items.map((item, index) => (
                  <div className="checklist-item" key={index}>
                    <span className="checklist-box">
                      {item.checked ? (
                        <FaCheckSquare color="#3B82F6" />
                      ) : (
                        <FiSquare />
                      )}
                    </span>
                    <span
                      className={item.checked ? "checklist-item-checked" : ""}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            );

          case "table":
            return (
              <table key={block.id}>
                <thead>
                  <tr>
                    {block.data.withHeadings &&
                      block.data.content[0].map((heading, index) => (
                        <th key={index}>{heading}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {(block.data.withHeadings
                    ? block.data.content.slice(1)
                    : block.data.content
                  ).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            );

          case "embed":
            return (
              <div className="embed-container" key={block.id}>
                <iframe
                  src={block.data.embed}
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={block.data.caption || "Embedded Content"}
                ></iframe>
              </div>
            );

          default:
            return <p key={block.id}>지원하지 않는 블록 형식: {block.type}</p>;
        }
      })}
    </>
  );
}

// =============================================================================
// 📖 질문 상세 페이지
// =============================================================================

export default function QuestionDetailPage({ params }) {
  // 가상 데이터: 전하의 모든 플러그인에 대한 예시를 포함합니다.
  const questionData = {
    title: "Next.js에서 Editor.js 렌더링하기",
    author: "지혜를 구하는 자",
    createdAt: new Date().toISOString(),
    content: {
      blocks: [
        {
          id: "h1",
          type: "header",
          data: { text: "헤더 1: 가장 큰 제목입니다.", level: 1 },
        },
        {
          id: "p1",
          type: "paragraph",
          data: {
            text: "이곳은 일반적인 문단입니다. <b>굵은 글씨</b>와 <mark>하이라이트</mark>를 지원합니다.",
          },
        },
        {
          id: "q1",
          type: "quote",
          data: {
            text: "위대한 발견은 작은 호기심에서 비롯되옵니다.",
            caption: "익명의 현자",
          },
        },
        {
          id: "ul1",
          type: "list",
          data: { style: "unordered", items: ["첫 번째 항목", "두 번째 항목"] },
        },
        {
          id: "cl1",
          type: "checklist",
          data: {
            items: [
              { text: "완료된 항목", checked: true },
              { text: "해야 할 항목", checked: false },
            ],
          },
        },
        {
          id: "h2",
          type: "header",
          data: { text: "헤더 2: 코드와 이미지", level: 2 },
        },
        {
          id: "c1",
          type: "code",
          data: { code: 'const a = "Hello, World!";\nconsole.log(a);' },
        },
        {
          id: "img1",
          type: "image",
          data: {
            file: {
              url: "https://placehold.co/600x400/3B82F6/white?text=Gorae",
            },
            caption: "고래 이미지 예시",
          },
        },
        {
          id: "h3",
          type: "header",
          data: { text: "헤더 3: 표와 임베드", level: 3 },
        },
        {
          id: "tbl1",
          type: "table",
          data: {
            withHeadings: true,
            content: [
              ["언어", "프레임워크"],
              ["JavaScript", "React/Next.js"],
              ["Python", "Django"],
            ],
          },
        },
        {
          id: "emb1",
          type: "embed",
          data: {
            service: "youtube",
            embed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            source: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          },
        },
      ],
    },
  };

  return (
    <ArticleContainer>
      <QuestionHeader>
        <QuestionTitle>{questionData.title}</QuestionTitle>
        <AuthorInfo>
          <FaUserCircle size={24} />
          <span>{questionData.author}</span>
          <span>·</span>
          <span>{new Date(questionData.createdAt).toLocaleDateString()}</span>
        </AuthorInfo>
      </QuestionHeader>

      <ContentBody>
        <BlockRenderer blocks={questionData.content.blocks} />
      </ContentBody>
    </ArticleContainer>
  );
}
