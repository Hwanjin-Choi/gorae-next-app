import axios from "axios";

// =============================================================================
// 1. 토큰 관리 유틸리티 (기존과 동일)
// =============================================================================
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

const getRefreshToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("refreshToken");
  }
  return null;
};

const setToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", token);
  }
};

// =============================================================================
// 2. Axios 인스턴스 생성 (✨ 수정된 부분)
// =============================================================================

const apiClient = axios.create({
  // ✨ baseURL을 Next.js의 rewrite 경로로 변경합니다.
  // process.env.NEXT_PUBLIC_API_BASE_URL 대신 '/api'를 사용합니다.
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  // 쿠키나 인증 헤더를 다른 도메인(여기서는 프록시)으로 보낼 때 필요합니다.
  withCredentials: true,
});

// =============================================================================
// 3. 요청 인터셉터 (기존과 동일)
// =============================================================================
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =============================================================================
// 4. 응답 인터셉터 (✨ 수정된 부분)
// =============================================================================
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        const { data } = await axios.post(
          "/api/user/v1/auth/refresh", // 이 경로는 전하의 실제 토큰 갱신 API 경로로 맞춰야 합니다.
          { token: refreshToken },
          { withCredentials: true } // 이 요청에도 withCredentials가 필요할 수 있습니다.
        );

        // 백엔드가 반환하는 새로운 액세스 토큰의 필드명에 따라 'data.accessToken'을 수정하십시오.
        const newAccessToken = data.data.access.token;
        console.log(data.data.access.token);
        setToken(newAccessToken);

        // 기본 인스턴스와 원래 요청의 헤더를 모두 갱신합니다.
        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error(
          "토큰 갱신에 실패하여 로그아웃 처리합니다:",
          refreshError
        );
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
