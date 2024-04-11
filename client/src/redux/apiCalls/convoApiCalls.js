import { publicRequest } from "../../requestMethods";
import {
  convoFailure,
  convoFetchSuccess,
  convoPostSuccess,
  convoStart,
  convoSuccess,
} from "../conversationSlice";

// get conversations of the current user
export const getConversations = async (dispatch, userId) => {
  dispatch(convoStart());
  try {
    const res = await publicRequest.get(`conversations/${userId}`);
    dispatch(convoFetchSuccess(res.data));
  } catch (error) {
    dispatch(convoFailure());
  }
};

// create a new conversation
export const newConversation = async (dispatch, userId, id) => {
  dispatch(convoStart());
  try {
    const res = await publicRequest.post(`conversations`, {
      senderId: userId,
      receiverId: id,
    });
    console.log("cc", res);
    if (res?.status == 202) return res.data;
    res?.status == 200 && dispatch(convoPostSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(convoFailure());
  }
};

export const getUsers = async (dispatch, userList) => {
  dispatch(convoStart());
  try {
    const res = await publicRequest.post("conversations/convoUsers", {
      data: userList,
    });
    dispatch(convoSuccess());
    return res.data;
  } catch (error) {
    dispatch(convoFailure());
    return error.message;
  }
};
