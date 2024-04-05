import {
  platformsFetchSuccess,
  platformSetSuccess,
  profileFailure,
  profileStart,
  profileSuccess,
  heatmapsFetchSuccess,
} from "../profileSlice";
import { publicRequest, userRequest } from "../../requestMethods";
import { toast } from "react-toastify";

// Function to fetch user profile
export const getProfile = async (dispatch, user) => {
  dispatch(profileStart());
  toast("Fetching Profile!");
  try {
    const res = await userRequest.get(`/user/profile/${user}`);
    dispatch(
      profileSuccess({
        user: res.data.data.user,
      })
    );
  } catch (error) {
    toast("User not Found!");
    dispatch(profileFailure());
  }
};

// Function to add a coding platform to user's profile
export const setPlatform = async (dispatch, platform, user) => {
  dispatch(profileStart());
  toast("Updating...");
  try {
    const res = await userRequest.post("/user/addCodingPlatform", platform);
    await dispatch(platformSetSuccess());
    toast(`${res.data.message}`);
  } catch (error) {
    dispatch(profileFailure());
    toast(`${error.response.data.message}`);
  }
};
// Function to fetch details of user's coding platforms
export const getPlatforms = async (dispatch, platforms) => {
  dispatch(profileStart());
  toast("Fetching User Details");
  try {
    const payload = [];
    await platforms.forEach(async (platform) => {
      const res = await publicRequest.get(
        `/${platform.platformName.toLowerCase()}/userdetails/${
          platform.platformHandler
        }`
      );

      payload.filter((obj) => obj.profileLink == res.data.data.profileLink)
        .length === 0;

      payload.push(res.data.data);

      if (payload.length === platforms.length) {
        dispatch(
          platformsFetchSuccess({
            platforms: payload,
          })
        );
      }
    });
  } catch (error) {
    dispatch(profileFailure());
    toast("Unable to fetch user details");
  }
};
// Function to fetch heatmaps of user's coding platforms
export const getHeatmaps = async (dispatch, platforms) => {
  dispatch(profileStart());
  try {
    const payload = [];
    await platforms.forEach(async (platform) => {
      const res = await publicRequest.post(
        `/${platform.platformName.toLowerCase()}/userHeatMap`,
        {
          username: platform.platformHandler,
          userid: platform.platformUserId,
          year: 2024,
        }
      );
      console.log(res.data.data);
      payload.filter((obj) => obj.profileLink == res.data.data.profileLink)
        .length === 0;
      payload.push(res.data.data);
      if (payload.length === platforms.length) {
        dispatch(
          heatmapsFetchSuccess({
            platforms: payload,
          })
        );
      }
    });
  } catch (error) {
    // Displaying toast notification for unable to fetch user details
    toast("Unable to fetch user details");
    dispatch(profileFailure());
  }
};
