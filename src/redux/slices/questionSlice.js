import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/api";
// =============================================================================
// 1. 비동기 Thunk 생성 (API 호출 담당)
// =============================================================================

/**
 * 질문 목록을 가져오는 Thunk
 * @param {object} { page, offset, keyword } - 페이지네이션 및 검색어
 */
export const fetchQuestions = createAsyncThunk(
  "questions/fetchQuestions",
  async ({ page = 1, offset = 10, keyword = "" }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/post/v1/auth/questions`, {
        params: { page, offset, keyword },
      });
      // 실제 API 응답 형태에 맞춰 return해야 합니다.
      // 예: { data: [...], totalPages: 10 }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateQuestion = createAsyncThunk(
  "questions/updateQuestion",
  async (body, { rejectWithValue }) => {
    try {
      // 실제로는 PUT 또는 PATCH 메서드를 사용해야 합니다.
      const response = await apiClient.post(`/post/v1/questions/update`, body);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteQuestion = createAsyncThunk(
  "questions/deleteQuestion",
  async (body, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/post/v1/questions/delete`, body);
      console.log(response);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

/**
 * 특정 ID의 질문 상세 정보를 가져오는 Thunk
 * @param {number} questionId - 질문의 ID
 */
export const fetchQuestionById = createAsyncThunk(
  "questions/fetchQuestionById",
  async (questionId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/post/v1/auth/questions/detail`, {
        params: { questionId },
      });
      console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// =============================================================================
// 2. Slice 정의 (상태, 리듀서, 비동기 처리 로직)
// =============================================================================

const initialState = {
  list: [], // 질문 목록을 담을 배열
  pagination: {}, // 페이지네이션 정보를 담을 객체
  currentQuestion: null, // 현재 보고 있는 질문의 상세 정보
  currentQuestionAuthor: false,
  listStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  detailStatus: "idle",
  error: null,
};

const questionsSlice = createSlice({
  name: "questions",
  initialState,
  // 동기적인 상태 변경은 reducers에 작성합니다.
  reducers: {
    clearCurrentQuestion: (state) => {
      state.currentQuestion = null;
      state.detailStatus = "idle";
    },
  },
  // 비동기적인 상태 변경은 extraReducers에서 처리합니다.
  extraReducers: (builder) => {
    builder
      // fetchQuestions (목록 조회)의 상태 변화 처리
      .addCase(fetchQuestions.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        // API 응답에 따라 상태를 업데이트합니다.
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload;
      })
      // fetchQuestionById (상세 조회)의 상태 변화 처리
      .addCase(fetchQuestionById.pending, (state) => {
        state.detailStatus = "loading";
      })
      .addCase(fetchQuestionById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.currentQuestion = action.payload.data;
        state.currentQuestionAuthor = action.payload.data.author;
      })
      .addCase(fetchQuestionById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.error = action.payload;
      })
      .addCase(updateQuestion.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        // 수정 성공 시, 현재 보고 있는 질문의 내용을 서버에서 받은 최신 데이터로 갱신합니다.
        state.currentQuestion = action.payload.data;
      })
      .addCase(updateQuestion.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearCurrentQuestion } = questionsSlice.actions;

export default questionsSlice.reducer;
