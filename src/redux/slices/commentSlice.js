// src/redux/slices/commentSlice.js
import apiClient from "@/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/**
 * 특정 질문 ID에 해당하는 답변 목록을 가져오는 Thunk
 * @param {object} { questionId, page, size } - 질문 ID 및 페이지네이션 정보
 */
export const fetchCommentsByQuestionId = createAsyncThunk(
  "comments/fetchCommentsByQuestionId",
  async ({ questionId, page = 1, offset = 30 }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/post/v1/auth/comments/detail`, {
        params: { questionId, page, offset },
      });
      console.log(response);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (body, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `/post/v1/questions/answer/delete`,
        body
      );
      console.log(response);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async (body, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `/post/v1/questions/answer/update`,
        body
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const createComment = createAsyncThunk(
  "comments/createComment",
  async (body, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `/post/v1/questions/answer/create`,
        body
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createAdoptComment = createAsyncThunk(
  "comments/createAdoptComment",
  async (body, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `/post/v1/questions/answer/adopt`,
        body
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createLikeComment = createAsyncThunk(
  "comments/createLikeComment",
  async (body, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/post/v1/like`, body);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  comments: [], // 답변 목록
  pagination: {}, // 페이지네이션 정보
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  updateStatus: "idle",
  createStatus: "idle",
  deleteStatus: "idle",
  isAdopted: false,
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    // 컴포넌트가 언마운트될 때 상태를 초기화하는 리듀서
    clearComments: (state) => {
      state.comments = [];
      state.pagination = {};
      state.status = "idle";
      state.updateStatus = "idle";
      state.createStatus = "idle";
      state.error = null;
      state.isAdopted = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsByQuestionId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCommentsByQuestionId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.comments = action.payload.content;
        state.pagination = {
          pageNumber: action.payload.pageNumber,
          pageSize: action.payload.pageSize,
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
        };
        state.isAdopted = action.payload.adopted;
      })
      .addCase(fetchCommentsByQuestionId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateComment.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        const updatedComment = action.payload.data;

        // 기존 comments 배열을 순회하며 업데이트된 댓글의 id와 일치하는 댓글을 찾습니다.
        state.comments = state.comments.map((comment) => {
          if (comment.commentId === updatedComment.commentId) {
            // 일치하는 댓글을 찾았다면, 해당 댓글을 업데이트된 댓글 객체로 교체합니다.
            const newCommentBlock = updatedComment.commentContent;
            console.log(newCommentBlock);
            return { ...comment, commentContent: newCommentBlock };
          }
          // 일치하지 않는 댓글은 그대로 반환합니다.
          return comment;
        });
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.error = action.payload;
      })
      .addCase(createComment.pending, (state) => {
        state.createStatus = "loading";
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        console.log(action.payload.data, "redux ca;;ing");
        const newComment = {
          commentContent: action.payload.data.commentContent,
          updateAt: action.payload.data.createAt,
          likeCount: action.payload.data.likeCount,
          userInfoDto: action.payload.data.userInfo,
          adopt: action.payload.data.adopt,
        };
        state.comments = [...state.comments, newComment];
      })
      .addCase(createComment.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = action.payload;
      })
      .addCase(deleteComment.pending, (state) => {
        state.createStatus = "loading";
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.error = action.payload;
      })
      .addCase(createLikeComment.pending, (state) => {
        state.createStatus = "loading";
      })
      .addCase(createLikeComment.fulfilled, (state, action) => {
        console.log(action.payload, "redux ca;;ing");
        const commentToUpdate = state.comments.find(
          (comment) => comment.commentId === action.payload
        );

        console.log(commentToUpdate);
        if (commentToUpdate) {
          commentToUpdate.likeCount += 1;
          commentToUpdate.likeStatus = true;
        }
      })
      .addCase(createAdoptComment.fulfilled, (state, action) => {
        console.log(action.payload, "redux ca;;ing");
        const commentToUpdate = state.comments.find(
          (comment) => comment.commentId === action.payload
        );

        if (commentToUpdate) {
          commentToUpdate.adopt = true;
          state.isAdopted = true;
        }
      })
      .addCase(createAdoptComment.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearComments } = commentSlice.actions;

export default commentSlice.reducer;
