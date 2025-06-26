"use client";

import React from "react";
import styled from "styled-components";
import { FaCheckSquare } from "react-icons/fa";
import { FiSquare } from "react-icons/fi";

// =============================================================================
// 🎨 Styled Components - 렌더링될 콘텐츠의 모든 스타일을 이곳에서 관장합니다.
// =============================================================================
const ContentBody = styled.div`
  line-height: 1.7;
  color: ${({ theme }) => theme.text};

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 2.5rem 0 1rem;
    line-height: 1.3;
    font-weight: ${({ theme }) => theme.font.weight.semibold};
  }

  p {
    margin: 0 0 1.5rem;
  }

  ul,
  ol {
    margin: 0 0 1.5rem 1.5rem;
    padding: 0;
  }

  li {
    margin-bottom: 0.5rem;
  }

  blockquote {
    border-left: 4px solid ${({ theme }) => theme.border};
    padding-left: 1rem;
    margin: 2rem 0;
    color: ${({ theme }) => theme.text_secondary};
    font-style: italic;

    footer {
      margin-top: 0.5rem;
      font-style: normal;
    }
  }

  pre {
    background-color: ${({ theme }) => theme.bg};
    padding: 1rem;
    border-radius: 8px;
    margin: 2rem 0;
    overflow-x: auto;
    font-size: 0.9rem;
  }

  code {
    font-family: "D2Coding", "Consolas", "Monaco", monospace;
  }

  p > code,
  li > code {
    background-color: ${({ theme }) => theme.bg};
    padding: 0.2em 0.4em;
    border-radius: 4px;
    font-size: 85%;
  }

  figure {
    margin: 2rem 0;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.border};
  }

  figcaption {
    text-align: center;
    color: ${({ theme }) => theme.text_subtle};
    font-size: ${({ theme }) => theme.font.size.caption};
    margin-top: 0.5rem;
  }

  mark {
    background-color: ${({ theme }) => theme.accent}4D;
    border-radius: 3px;
    padding: 2px 4px;
  }

  .checklist {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin: 2rem 0;
    list-style: none;
    padding: 0;
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
    margin-top: 4px;
  }

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

  .embed-container {
    position: relative;
    padding-bottom: 56.25%;
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
// 📜 렌더러 로직 컴포넌트 (수정 완료)
// =============================================================================

const Renderer = ({ blocks }) => {
  if (!blocks || blocks.length === 0) {
    return <p>내용이 존재하지 않습니다.</p>;
  }

  return (
    <>
      {blocks.map((block) => {
        const { type, data, id } = block;

        switch (type) {
          case "header":
            const HeaderTag = `h${data.level}`;
            return (
              <HeaderTag
                key={id}
                dangerouslySetInnerHTML={{ __html: data.text }}
              />
            );

          case "paragraph":
            return (
              <p key={id} dangerouslySetInnerHTML={{ __html: data.text }} />
            );

          case "list":
            // 체크리스트와 일반 리스트를 모두 처리합니다.
            if (data.style === "checklist") {
              return (
                <div className="checklist" key={id}>
                  {data.items.map((item, index) => (
                    <div className="checklist-item" key={index}>
                      <span className="checklist-box">
                        {item.meta.checked ? (
                          <FaCheckSquare color="#3B82F6" />
                        ) : (
                          <FiSquare />
                        )}
                      </span>
                      <span
                        className={
                          item.meta.checked ? "checklist-item-checked" : ""
                        }
                      >
                        {item.content}
                      </span>
                    </div>
                  ))}
                </div>
              );
            }
            // 일반 리스트 (ordered, unordered)
            const ListTag = data.style === "ordered" ? "ol" : "ul";
            return (
              <ListTag key={id}>
                {data.items.map((item, index) => (
                  <li
                    key={index}
                    dangerouslySetInnerHTML={{ __html: item.content || item }}
                  />
                ))}
              </ListTag>
            );

          case "image":
            return (
              <figure key={id}>
                <img src={data.file.url} alt={data.caption || "이미지"} />
                <figcaption
                  dangerouslySetInnerHTML={{ __html: data.caption }}
                />
              </figure>
            );

          case "code":
            return (
              <pre key={id}>
                <code>{data.code}</code>
              </pre>
            );

          case "quote":
            return (
              <blockquote key={id}>
                <p dangerouslySetInnerHTML={{ __html: data.text }} />
                <footer dangerouslySetInnerHTML={{ __html: data.caption }} />
              </blockquote>
            );

          case "table":
            return (
              <table key={id}>
                <thead>
                  <tr>
                    {data.withHeadings &&
                      data.content[0].map((h, i) => <th key={i}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {(data.withHeadings
                    ? data.content.slice(1)
                    : data.content
                  ).map((r, i) => (
                    <tr key={i}>
                      {r.map((c, j) => (
                        <td key={j}>{c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            );

          case "embed":
            return (
              <div className="embed-container" key={id}>
                <iframe
                  src={data.embed}
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={data.caption || "Embedded Content"}
                ></iframe>
              </div>
            );

          default:
            return <p key={id}>지원하지 않는 블록 형식: {type}</p>;
        }
      })}
    </>
  );
};

// =============================================================================
// 📦 최종 공용 컴포넌트
// =============================================================================

function ContentRenderer({ blocks }) {
  return (
    <ContentBody>
      <Renderer blocks={blocks} />
    </ContentBody>
  );
}

export default ContentRenderer;
