import { createSlice } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    conversations: [],
    isFetching: false,
    error: false,
  },
  reducers: {
    convoStart: (state) => {
      state.isFetching = true;
    },
    convoFetchSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.conversations = action.payload;
    },
    convoSuccess: (state) => {
      state.isFetching = false;
      state.error = false;
    },
    convoPostSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.conversations = [...state.conversations, action.payload];
    },

    convoFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    convoClear: (state) => {
      state.isFetching = false;
      state.error = false;
      state.conversations = [];
    },
  },
});

export const {
  convoStart,
  convoFetchSuccess,
  convoFailure,
  convoPostSuccess,
  convoSuccess,
  convoClear,
} = conversationSlice.actions;
export default conversationSlice.reducer;
