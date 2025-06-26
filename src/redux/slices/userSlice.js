import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api";

// =============================================================================
// 1. 비동기 Thunk: 로그인 API 호출
// =============================================================================
export const loginUser = createAsyncThunk(
  "user/login",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/user/v1/auth/login", loginData);

      // API 응답에서 실제 데이터가 담긴 response.data.data를 사용합니다.
      const responseData = response.data.data;

      // 토큰들을 localStorage에 저장합니다.
      console.log(responseData, "Check");
      if (typeof window !== "undefined" && responseData.tokens) {
        localStorage.setItem("accessToken", responseData.tokens.access.token);
        localStorage.setItem("refreshToken", responseData.tokens.refresh.token);
      }

      // 사용자 정보 부분만 리듀서로 반환합니다.
      return {
        userName: responseData.userName,
        profileImgUrl: responseData.userProfile,
        // 필요하다면 다른 사용자 정보도 포함할 수 있습니다.
        // userId: responseData.userId
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getUserStatus = createAsyncThunk(
  "user/getUserStatus",
  async ({ rejectWithValue }) => {
    try {
      const response = await apiClient.get("/leaderboard/v1/detail");
      console.log(response);
      const responseData = response;

      return {
        likeBadge: responseData.likeBadge,
        userBadge: responseData.userBadge,
        profileImgUrl: responseData.profileImgUrl,
        userName: responseData.userName,
        likeCount: responseData.likeCount,
        commentCount: responseData.commentCount,
        selectedCount: responseData.selectedCount,
        selectedRate: responseData.selectedRate,
        // 필요하다면 다른 사용자 정보도 포함할 수 있습니다.
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// =============================================================================
// 2. Slice 정의
// =============================================================================
const initialState = {
  isLoggedIn: false,
  userName: "",
  profileImage: "",
  status: "idle",
  error: null,
  likeBadge: "1",
  userBadge: "1",

  likeCount: 0,
  commentCount: 0,
  selectedCount: 0,
  selectedRate: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.isLoggedIn = false;
      state.userName = "";
      state.profileImage = "";
      state.status = "idle";
      state.error = null;
      state.likeBadge = "1";
      state.userBadge = "1";

      state.likeCount = 0;
      state.commentCount = 0;
      state.selectedCount = 0;
      state.selectedRate = 0;

      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoggedIn = true;
        // action.payload에서 올바른 경로의 데이터를 찾아 상태를 업데이트합니다.
        state.userName = action.payload.userName;
        state.profileImage = action.payload.profileImgUrl;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.isLoggedIn = false;
        state.error = action.payload;
      })
      .addCase(getUserStatus.fulfilled, (state, action) => {
        state.status = "succeeded";

        // action.payload에서 올바른 경로의 데이터를 찾아 상태를 업데이트합니다.
        state.userName = action.payload.userName;

        state.likeBadge = action.payload.likeBadge;
        state.userBadge = action.payload.userBadge;
        state.profileImage = action.payload.profileImgUrl;
        state.userName = action.payload.userName;
        state.likeCount = action.payload.likeCount;
        state.commentCount = action.payload.commentCount;
        state.selectedCount = action.payload.selectedCount;
        state.selectedRate = action.payload.selectedRate;
      });
  },
});

export const { logoutUser } = userSlice.actions;

export default userSlice.reducer;
