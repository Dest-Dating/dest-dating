import { toast } from "react-toastify";
import { publicRequest, userRequest } from "../../requestMethods";
import {
  deleteUserSuccess,
  errorReset,
  getUsersSuccess,
  loginSuccess,
  logoutSuccess,
  photoUploadSuccess,
  updateSuccess,
  userFailure,
  userStart,
} from "../userSlice";

// function to log into the website
export const login = async (dispatch, user) => {
  // start fetching
  dispatch(userStart());
  try {
    // api call
    const res = await publicRequest.post("/user/login", user);
    // update state if login successfull
    dispatch(loginSuccess(res.data));
    toast("Logged In Successfully!");
  } catch (error) {
    // update state if login unsuccessfull
    dispatch(userFailure(error?.response?.data?.message));
    toast(error?.response?.data?.message);
  }
};

// function to register the user
export const signup = async (dispatch, setRegistered, user) => {
  dispatch(userStart());
  try {
    const res = await publicRequest.post("/user/signup", user);
    console.log(res.data);
    setRegistered(true);
    dispatch(errorReset());
  } catch (error) {
    dispatch(userFailure(error?.response?.data?.message));
    toast(error?.response?.data?.message);
  }
};

// function to verify otp
export const verifyOtp = async (dispatch, user) => {
  dispatch(userStart());
  try {
    const res = await publicRequest.post("/user/verifyEmail", user);
    console.log(res.data);
    toast("Registation Successful!");
    dispatch(loginSuccess(res.data));
    toast("You have been logged In");
  } catch (error) {
    dispatch(userFailure(error?.response?.data?.message));
    toast(error?.response?.data?.message);
  }
};
// function to add a Single Photo
export const addSinglePhoto = async (
  dispatch,
  link,
  currentInd,
  completeUser
) => {
  dispatch(userStart());
  try {
    const res = await publicRequest.post("/user/addPhotoLink", {
      photoLink: link,
      index: currentInd,
    });
    console.log(res?.data?.data?.user);
    dispatch(
      photoUploadSuccess({
        ...completeUser,
        data: { user: res?.data?.data?.user },
      })
    );
    toast("Photo Uploaded");
  } catch (error) {
    dispatch(userFailure(error?.response?.data?.message));
    toast(error?.response?.data?.message);
  }
};

// function to delete a Single Photo
export const deleteSinglePhoto = async (dispatch, link, completeUser) => {
  dispatch(userStart());
  try {
    const res = await publicRequest.post("/user/deletePhotoLink", {
      photoLink: link,
    });
    console.log(res?.data?.data?.user);
    dispatch(
      photoUploadSuccess({
        ...completeUser,
        data: { user: res?.data?.data?.user },
      })
    );
    toast("Photo Deleted");
  } catch (error) {
    dispatch(userFailure(error?.response?.data?.message));
    toast(error?.response?.data?.message);
  }
};

// function to update user
export const profileComplete = async (
  dispatch,
  userData,
  completeUser,
  navigate
) => {
  dispatch(userStart());
  try {
    console.log(userData);
    const res = await userRequest.post("/user/updateDetails", userData);
    dispatch(
      photoUploadSuccess({
        ...completeUser,
        data: { user: res?.data?.user },
      })
    );
    toast("Profile Updated Successfully!");
    navigate("/home");
  } catch (error) {
    dispatch(userFailure(error?.response?.data?.message));
    toast(error?.response?.data?.message);
  }
};

// function to update password
export const updatePassword = async (dispatch, passwords) => {
  dispatch(userStart());
  try {
    const res = await userRequest.patch("/user/updateMyPassword", {
      ...passwords,
    });
    dispatch(updateSuccess(res.data));
    toast("Password updated Successfully!");
  } catch (error) {
    dispatch(userFailure(error?.response?.data?.message));
    toast(error?.response?.data?.message);
  }
};
// function to logout user
export const logoutUser = async (dispatch) => {
  dispatch(userStart());
  try {
    // const res = await userRequest.post("/user/logout");
    dispatch(logoutSuccess());
    toast("Password updated Successfully!");
  } catch (error) {
    dispatch(userFailure(error?.response?.data?.message));
    toast(error?.response?.data?.message);
  }
};

// function to delete the user
export const deleteUser = async (dispatch, password) => {
  dispatch(userStart());
  try {
    const res = await userRequest.post("/user/deleteMe", {
      password: password,
    });
    toast("Your account has been deleted");
    dispatch(deleteUserSuccess());
  } catch (error) {
    dispatch(userFailure(error?.response?.data?.message));
    toast(error?.response?.data?.message);
  }
};

// function to log into the website
export const oAuthLogin = async (dispatch, navigate) => {
  // start fetching
  dispatch(userStart());
  try {
    // api call
    const res = await publicRequest.get("/user/getMe");
    // update state if login successfull
    dispatch(loginSuccess(res.data));
    toast("Logged In Successfully!");
    navigate("/questions");
  } catch (error) {
    // update state if login unsuccessfull
    dispatch(userFailure(error?.response?.data?.message));
    toast(error?.response?.data?.message);
  }
};
