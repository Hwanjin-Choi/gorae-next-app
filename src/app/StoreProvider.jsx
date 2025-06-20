// src/app/StoreProvider.jsx
"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore } from "../redux/store"; // store를 만드는 함수를 임포트 (아래에서 수정할 것입니다)
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

export default function StoreProvider({ children }) {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    // 컴포넌트가 처음 렌더링될 때만 스토어를 생성합니다.
    storeRef.current = makeStore();
    storeRef.current.persistor = persistStore(storeRef.current.store);
  }

  return (
    <Provider store={storeRef.current.store}>
      <PersistGate loading={null} persistor={storeRef.current.persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
