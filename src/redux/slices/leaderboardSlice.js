import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api";

// 좋아요 랭킹 API 호출
export const fetchLikesRanking = createAsyncThunk(
  "leaderboard/fetchLikes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/leaderboard/v1/auth/likes/all");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 채택 수 랭킹 API 호출
export const fetchSelectedRanking = createAsyncThunk(
  "leaderboard/fetchSelected",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/leaderboard/v1/auth/selected/all");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 채택률 랭킹 API 호출
export const fetchSelectedRateRanking = createAsyncThunk(
  "leaderboard/fetchSelectedRate",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        "/leaderboard/v1/auth/selectedrate/all"
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchMyProfile = createAsyncThunk(
  "leaderboard/fetchMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/leaderboard/v1/detail");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const initialState = {
  rankings: {
    likes: [],
    selected: [],
    selectedRate: [],
  },
  myProfile: null,
  myProfileStatus: "idle",
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 공통 로딩 상태 처리

      // 각 API 성공 시 데이터 저장
      .addCase(fetchLikesRanking.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.rankings.likes = action.payload;
      })
      .addCase(fetchSelectedRanking.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.rankings.selected = action.payload;
      })
      .addCase(fetchSelectedRateRanking.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.rankings.selectedRate = action.payload;
      })
      .addCase(fetchMyProfile.pending, (state) => {
        state.myProfileStatus = "loading";
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.myProfileStatus = "succeeded";
        state.myProfile = action.payload;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.myProfileStatus = "failed";
        state.error = action.payload;
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("leaderboard/") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
        }
      )
      // 공통 에러 상태 처리
      .addMatcher(
        (action) =>
          action.type.startsWith("leaderboard/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        }
      );
  },
});

export default leaderboardSlice.reducer;
