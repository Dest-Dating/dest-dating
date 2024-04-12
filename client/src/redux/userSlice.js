import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user", initialState: {
    currentUser: null, isFetching: false, error: false, errorMsg: null, dark: true,
  }, reducers: {
    // Reducer for setting fetching state to true
    userStart: (state) => {
      state.isFetching = true;
    }, // Reducer for successful login
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.errorMsg = null;
      state.currentUser = action.payload;
    }, // Reducer for successful user data update
    updateSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.errorMsg = null;
      state.currentUser = action.payload;
    }, // Reducer for successful logout

    logoutSuccess: (state) => {
      state.isFetching = false;
      state.error = false;
      state.currentUser = null;
      state.errorMsg = null;
    },

    // Reducer for uploading photo
    photoUploadSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.errorMsg = null;
      state.currentUser = action.payload;
    },

    // Reducer for resetting error state
    errorReset: (state) => {
      state.isFetching = false;
      state.error = false;
      state.errorMsg = null;
    }, // Reducer for successful user deletion
    deleteUserSuccess: (state) => {
      state.isFetching = false;
      state.error = false;
      state.currentUser = null;
      state.errorMsg = null;
    }, // successfull fetch
    getUsersSuccess: (state) => {
      state.isFetching = false;
      state.error = false;
    }, // Reducer for user-related errors
    userFailure: (state, action) => {
      state.isFetching = false;
      state.errorMsg = action.payload;
      state.error = true;
    }, logOut: (state) => {
      state.isFetching = false;
      state.error = false;
      state.currentUser = null;
      state.errorMsg = null;
    }, // Reducer for changing user theme
    changeUserTheme: (state, action) => {
      state.isFetching = false;
      state.dark = action.payload;
      state.error = false;
    },
  },
});

export const {
  userStart,
  loginSuccess,
  deleteUserSuccess,
  logoutSuccess,
  updateSuccess,
  userFailure,
  errorReset,
  logOut,
  getUsersSuccess,
  changeUserTheme,
  photoUploadSuccess,
} = userSlice.actions;
export default userSlice.reducer;
