import { createSlice } from "@reduxjs/toolkit";

// Creating a slice for managing profile state
export const profileSlice = createSlice({
  name: "profile",
  initialState: {
    user: null,
    platforms: [],
    heatmaps: [],
    isFetching: false,
    error: false,
  },
  reducers: {
    // Reducer for setting fetching status
    profileStart: (state) => {
      state.isFetching = true;
    },
     // Reducer for handling successful profile data retrieval
    profileSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.user = action.payload.user;
    },
    // Reducer for handling successful platform set
    platformSetSuccess: (state) => {
      state.isFetching = false;
      state.error = false;
    },
    // Reducer for handling successful platform details retrieval
    platformsFetchSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.platforms = action.payload.platforms;
    },
    // Reducer for handling successful heatmap retrieval
    heatmapsFetchSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      console.log("huuu", action.payload.platforms);
      state.heatmaps = action.payload.platforms;
    },
    // Reducer for handling profile data retrieval failure
    profileFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    // Reducer for clearing profile state
    clearProfile: (state) => {
      state.isFetching = false;
      state.error = false;
      state.user = null;
      state.platforms = [];
      state.heatmaps = [];
    },
  },
});
// Exporting actions and reducer
export const {
  profileStart,
  profileFailure,
  profileSuccess,
  platformSetSuccess,
  platformsFetchSuccess,
  heatmapsFetchSuccess,
  clearProfile,
} = profileSlice.actions;
export default profileSlice.reducer;
