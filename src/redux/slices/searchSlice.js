import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/api";

export const fetchQuestions = createAsyncThunk(
  "search/fetchQuestions",
  async ({ keyword, page, offset }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/post/v1/auth/questions", {
        params: { keyword, page, offset },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  questions: [],
  keyword: "",
  currentPage: 1,
  totalPages: 1,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setKeyword: (state, action) => {
      state.keyword = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload.data.questions);
        state.questions = action.payload.data.questions;
        state.totalPages = action.payload.data.totalPages;
        state.currentPage = action.payload.data.page;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setKeyword, setCurrentPage } = searchSlice.actions;
export default searchSlice.reducer;
