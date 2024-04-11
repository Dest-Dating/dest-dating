import React, { useEffect, useState } from "react";
import { getConversations, getUsers } from "../../redux/apiCalls/convoApiCalls";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const Conversations = ({ chatUsers, setChatUsers, setOpenConvo }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id: userId } = useSelector(
    (state) => state.user.currentUser?.data?.user
  );

  const conversations = useSelector(
    (state) => state.conversations.conversations
  );

  const getConvo = () => {
    (async () => {
      await getConversations(dispatch, userId);
    })();
  };

  useEffect(() => {
    (async () => {
      await getConvo();
    })();
  }, []);

  const setConversation = async (id, userId) => {
    const selectedConvo = conversations.find((convo) =>
      convo.members.find((userId) => userId === id)
    );
    setOpenConvo(selectedConvo);
  };

  const getDetails = async (userIds) => {
    if (userIds.length > 0) {
      const userDetails = await getUsers(dispatch, userIds);
      setChatUsers(userDetails);
    } else setChatUsers([]);
  };

  useEffect(() => {
    // eslint-disable-next-line no-extra-boolean-cast
    const userIds = !!conversations[0]?._id
      ? conversations.map((convo) => {
          if (convo.members[0] === userId) {
            return convo.members[1];
          } else {
            return convo.members[0];
          }
        })
      : [];
    (async () => {
      await getDetails(userIds);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations, userId]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md h-screen">
      <h2 className="text-lg font-bold mb-4">Conversations</h2>
      {/* Mapping over conversations array to render each conversation */}
      {chatUsers.map((conversation) => (
        <div
          key={conversation.userId}
          onClick={() => {
            navigate("/home/chats");
            setConversation(conversation.userId, userId);
          }}
          className="flex items-center mb-4"
        >
          {/* Profile Picture */}
          <div className="bg-red-300 rounded-md">
            <img
              src={conversation.profilePicture.photoLink}
              alt="Profile"
              className="w-12 h-12 rounded-full mr-4"
            />
            {/* Name and Latest Message */}
            <div>
              <h3 className="text-lg font-semibold">{conversation.name}</h3>
              <p className="text-gray-500">{conversation.latestMessage}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Conversations;
