// src/app/layout.jsx
import StyledComponentsRegistry from "../lib/StyledComponentsRegistry";
import StoreProvider from "./StoreProvider";
import ClientWrapper from "./ClientWrapper";

export const metadata = {
  title: "지성의 바다",
  description: "세상의 모든 지식을 여기에",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <StyledComponentsRegistry>
          <StoreProvider>
            <ClientWrapper>{children}</ClientWrapper>
          </StoreProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
