# 🐋 고래 - 지식 공유 플랫폼 (Gorae)

**고래**는 Next.js와 MSA 아키텍처를 기반으로 구축된 최신 기술 스택의 지식 공유 Q&A 플랫폼입니다. 사용자는 질문을 게시하고, 다른 사용자의 질문에 답변하며, 지식을 통해 상호작용하고 성장할 수 있습니다. 이 프로젝트는 첫 Next.js 프로젝트로서, 최신 웹 기술과 효율적인 개발 패턴을 적용하여 포트폴리오용으로 제작되었습니다.

## ✨ 주요 기능 (Features)

- **질문 및 답변 (Q&A)**: 사용자는 직관적인 UI를 통해 질문을 작성하고 다른 사람의 질문에 답변할 수 있습니다.
- **풍부한 텍스트 에디터**: `Editor.js`를 도입하여 블록 기반의 현대적이고 확장 가능한 텍스트 에디터를 제공합니다. (헤더, 목록, 코드, 이미지, 인용 등 지원)
- **사용자 인증**: JWT 기반의 안전한 로그인 및 회원가입 기능을 제공하며, `Axios Interceptor`를 활용하여 토큰 자동 갱신을 구현했습니다.
- **사용자 프로필 및 랭킹**: 사용자별 활동(좋아요, 채택 수, 채택률)을 시각적으로 보여주는 프로필과 명예의 전당(랭킹) 페이지를 제공합니다.
- **답변 채택 및 좋아요**: 질문 작성자는 가장 도움이 된 답변을 '채택'할 수 있으며, 다른 사용자들은 유용한 답변에 '좋아요'를 표시할 수 있습니다.
- **다크/라이트 모드**: 사용자의 시스템 설정을 감지하여 자동으로 테마를 전환하며, 수동 변경도 가능한 테마 기능을 제공합니다.
- **검색 및 페이지네이션**: 키워드 기반의 질문 검색 기능과 페이지네이션을 통해 사용자가 원하는 정보를 쉽게 찾을 수 있습니다.
- **반응형 디자인**: 모바일, 태블릿, 데스크탑 등 모든 디바이스에서 최적의 사용자 경험을 제공합니다.

---

## 🛠️ 기술 스택 (Tech Stack)

| 구분                 | 기술                             | 설명                                                                                       |
| :------------------- | :------------------------------- | :----------------------------------------------------------------------------------------- |
| **Core**             | `Next.js` (v15), `React` (v19)   | App Router 기반의 최신 Next.js를 사용하여 SSR/CSR의 이점을 극대화했습니다.                 |
| **State Management** | `Redux Toolkit`, `Redux Persist` | 전역 상태 관리를 위한 `Redux Toolkit`과 상태 영속성을 위한 `Redux Persist`를 사용했습니다. |
| **Styling**          | `Styled-components`              | CSS-in-JS 라이브러리로, 컴포넌트 기반의 동적 스타일링 및 테마 기능을 구현했습니다.         |
| **Data Fetching**    | `Axios`                          | Interceptor를 활용하여 API 요청/응답을 중앙에서 관리하고, 토큰 기반 인증을 처리합니다.     |
| **Text Editor**      | `Editor.js`                      | 블록 스타일의 확장성 높은 WYSIWYG 에디터를 적용했습니다.                                   |
| **Deployment**       | `Vercel` (권장)                  | Next.js에 최적화된 배포 환경을 제공합니다.                                                 |

---

## 📂 프로젝트 구조

## 프로젝트는 기능과 역할에 따라 명확하게 분리된 모듈식 구조를 따릅니다. 이는 유지보수성과 확장성을 높이는 데 기여합니다.

---

## <img width="732" alt="Image" src="https://github.com/user-attachments/assets/87765757-fc5e-4f47-84ba-7390a0bc1da2" />

## ✨ 프로젝트의 강점

이 프로젝트는 다음과 같은 강점을 통해 전하의 기술적 역량을 효과적으로 보여줄 수 있습니다.

1.  **최신 기술 스택 활용**: **Next.js 15**의 App Router와 **React 19**를 사용하여 서버 컴포넌트와 클라이언트 컴포넌트를 적절히 활용, 렌더링 성능을 최적화했습니다.
2.  **견고한 상태 관리 아키텍처**: `Redux Toolkit`을 사용하여 보일러플레이트를 줄이고, `createAsyncThunk`로 비동기 로직을 체계적으로 관리합니다. `Redux Persist`를 통해 사용자 경험(예: 테마 유지)을 향상시켰습니다.
3.  **컴포넌트 중심의 재사용성**: 공용 `common` 컴포넌트와 기능별 컴포넌트를 명확히 분리하여 코드의 재사용성을 높이고 개발 효율성을 증대시켰습니다. (`UserProfile`, `Pagination`, `Modal` 등)
4.  **효율적인 API 관리**: `Axios Interceptor`를 활용하여 모든 API 요청에 인증 토큰을 자동으로 추가하고, 401 에러 발생 시 Refresh Token으로 Access Token을 재발급하는 **자동 갱신 로직**을 구현하여 안정적인 사용자 세션을 보장합니다.
5.  **동적이며 직관적인 UI/UX**: `Styled-components`의 `ThemeProvider`를 활용한 다크/라이트 모드, 로딩 상태를 보여주는 스켈레톤 UI, 작업 성공/실패를 알려주는 인터랙티브 모달 등 사용자 친화적인 UI를 구축했습니다.

---

## 🚀 시작하기 (Getting Started)

1.  **저장소 복제 (Clone the repository)**

    ```bash
    git clone [https://github.com/hwanjin-choi/gorae-next-app.git](https://github.com/hwanjin-choi/gorae-next-app.git)
    cd gorae-next-app
    ```

2.  **의존성 설치 (Install dependencies)**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **개발 서버 실행 (Run the development server)**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

4.  브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 결과를 확인합니다.
