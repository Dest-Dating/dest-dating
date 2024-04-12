import React, { useEffect } from "react";
import { getConversations, getUsers } from "../../redux/apiCalls/convoApiCalls";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const Conversations = ({
  chatUsers,
  setChatUsers,
  setOpenConvo,
  matchedUser,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const path = useLocation().pathname.split("/")[2];
  const currentUser = useSelector(
    (state) => state.user.currentUser?.data?.user
  );
  const userId = currentUser?._id;
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

  // starting chat with selected user
  const setConversation = async (id, userId) => {
    const selectedConvo = conversations.find((convo) =>
      convo.members.find((userId) => userId === id)
    );
    setOpenConvo(selectedConvo);
  };

  // getting complete details of users
  const getDetails = async (userIds) => {
    if (userIds.length > 0) {
      const userDetails = await getUsers(dispatch, userIds);
      setChatUsers(userDetails);
    } else setChatUsers([]);
    console.log(chatUsers);
  };

  // creating a list of userIds of users in conversations
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
    <div className="p-4 bg-red-50 rounded-lg shadow-md h-[calc(100vh-100px)] md:h-[calc(100vh-60px)] overflow-y-scroll">
      <h2 className="text-lg font-bold mb-4">Conversations</h2>
      {/* Mapping over conversations array to render each conversation */}
      {chatUsers.map((conversation) => (
        <div
          key={conversation.userId}
          onClick={async () => {
            // 💥💥💥💥💥💥💥💥navigate was after setConversations, change if there are bugs
            await setConversation(conversation.userId, userId);
            navigate("/home/chats");
          }}
          className="flex items-center mb-4"
        >
          {/* Profile Picture */}
          <div className="rounded-md w-full flex items-center hover:shadow-md bg-transparent/5 shadow p-2 cursor-pointer">
            <img
              src={conversation.profilePicture.photoLink}
              alt="Profile"
              className="w-8 h-8 rounded-full mr-4"
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
