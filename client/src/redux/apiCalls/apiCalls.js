import { toast } from "react-toastify";
import { publicRequest, userRequest } from "../../requestMethods";
import {
  deleteUserSuccess,
  errorReset,
  loginSuccess,
  logoutSuccess,
  photoUploadSuccess,
  updateSuccess,
  userFailure,
  userStart,
} from "../userSlice";
import { newConversation } from "./convoApiCalls";
import { convoClear } from "../conversationSlice";

// function to log into the website
export const login = async (dispatch, user) => {
  // start fetching

  dispatch(userStart());
  const id = toast.loading("Logging you in");
  try {
    // api call
    const res = await publicRequest.post("/user/login", user);
    // update state if login successfull
    dispatch(loginSuccess(res.data));
    toast.update(id, {
      render: "Login success!",
      type: "success",
      isLoading: false,
      autoClose: 2000,
    });
    return true;
  } catch (error) {
    // update state if login unsuccessfull
    dispatch(userFailure(error?.response?.data?.message));
    toast.update(id, {
      render: error?.response?.data?.message,
      type: "error",
      isLoading: false,
      autoClose: 2000,
    });
    return false;
  }
};

// function to register the user
export const signup = async (dispatch, setRegistered, user) => {
  dispatch(userStart());
  const id = toast.loading("Signing you in");
  try {
    const res = await publicRequest.post("/user/signup", user);
    console.log(res.data);
    setRegistered(true);
    dispatch(errorReset());
    toast.update(id, {
      render: "Signed up successfully!",
      type: "success",
      isLoading: false,
      autoClose: 2000,
    });
  } catch (error) {
    dispatch(userFailure(error?.response?.data?.message));
    toast.update(id, {
      render: error?.response?.data?.message,
      type: "error",
      isLoading: false,
      autoClose: 2000,
    });
  }
};

// function to verify otp
export const verifyOtp = async (dispatch, user) => {
  dispatch(userStart());
  const id = toast.loading("Verifying OTP");
  try {
    const res = await publicRequest.post("/user/verifyEmail", user);
    console.log(res.data);
    toast.update(id, {
      render: "Registered Successfully!",
      type: "success",
      isLoading: false,
      autoClose: 2000,
    });
    dispatch(loginSuccess(res.data));
    // toast("You have been logged In");
    return true;
  } catch (error) {
    dispatch(userFailure(error?.response?.data?.message));
    toast.update(id, {
      render: error?.response?.data?.message,
      type: "error",
      isLoading: false,
      autoClose: 2000,
    });
    return false;
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
  const id = toast.loading("Uploading image...");
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
    toast.update(id, {
      render: "Image uploaded.",
      type: "success",
      isLoading: false,
      autoClose: 2000,
    });
  } catch (error) {
    dispatch(userFailure(error?.response?.data?.message));
    toast.update(id, {
      render: error?.response?.data?.message,
      type: "error",
      isLoading: false,
      autoClose: 2000,
    });
  }
};

// function to delete a Single Photo
export const deleteSinglePhoto = async (dispatch, link, completeUser) => {
  dispatch(userStart());
  const id = toast.loading("Deleting image...");
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
    toast.update(id, {
      render: "Image Deleted.",
      type: "success",
      isLoading: false,
      autoClose: 2000,
    });
  } catch (error) {
    dispatch(userFailure(error?.response?.data?.message));
    toast.update(id, {
      render: error?.response?.data?.message,
      type: "error",
      isLoading: false,
      autoClose: 2000,
    });
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
    toast("Password updated!");
  } catch (error) {
    dispatch(userFailure(error?.response?.data?.message));
    toast(error?.response?.data?.message);
  }
};

// function to logout user
export const logoutUser = async (dispatch, navigate) => {
  dispatch(userStart());
  try {
    await userRequest.post("/user/logout");
    dispatch(logoutSuccess());
    dispatch(convoClear());
    toast("Logged out Successfully!");
    navigate("/");
    toast("Password updated!");
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

// function to login using google oAuth
export const oAuthLogin = async (dispatch, navigate) => {
  // start fetching
  dispatch(userStart());
  try {
    // api call
    const res = await publicRequest.get("/user/getMe");
    // update state if login successfull
    dispatch(loginSuccess(res.data));
    // toast("Logged In Successfully!");
    navigate("/questions");
  } catch (error) {
    // update state if login unsuccessfull
    dispatch(userFailure(error?.response?.data?.message));
    toast(error?.response?.data?.message);
  }
};

// match comntrolls

// like
export const likeUser = async (dispatch, email, completeUser) => {
  dispatch(userStart());
  try {
    const res = await userRequest.put("/user/likeUser", {
      email,
    });
    console.log("dildo", res.data);
    dispatch(
      updateSuccess({
        ...completeUser,
        data: { user: res?.data?.currentUser },
      })
    );
    if (res?.data?.wasAMatch) {
      setMatchedUser(res?.data?.likedUser);
      newConversation(
        dispatch,
        res?.data?.currentUser?._id,
        res?.data?.likedUser._id
      );
      navigate("/home/match");
    }
    toast("<3");
  } catch (error) {
    dispatch(userFailure(error?.response?.data?.message));
    toast(error?.response?.data?.message);
  }
};

// Reject
export const rejectUser = async (dispatch, email, completeUser) => {
  dispatch(userStart());
  try {
    const res = await userRequest.put("/user/rejectUser", {
      email,
    });

    console.log(res.data);
    dispatch(
      updateSuccess({
        ...completeUser,
        data: { user: res?.data?.user },
      })
    );
    toast("</3");
  } catch (error) {
    dispatch(userFailure(error?.response?.data?.message));
    toast(error?.response?.data?.message);
  }
};
