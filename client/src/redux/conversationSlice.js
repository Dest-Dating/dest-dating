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
    convoPostSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.conversations = [...state.conversations, action.payload];
    },

    convoFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const { convoStart, convoFetchSuccess, convoFailure, convoPostSuccess } =
  conversationSlice.actions;
export default conversationSlice.reducer;
