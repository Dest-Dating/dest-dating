import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { newConversation } from "../redux/apiCalls/convoApiCalls";

const WasAMatch = ({ currentUser, matchedUser, setOpenConvo }) => {
  // use conversations state and check fousers existing in that convo
  console.log(matchedUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const conversations = useSelector(
    (state) => state.conversations.conversations
  );

  // setting up conversation
  // starting chat with selected user
  const setConversation = async (id) => {
    const selectedConvo = conversations.find((convo) =>
      convo.members.find((userId) => userId === id)
    );
    setOpenConvo(selectedConvo);
  };

  return (
    <div className="flex justify-center relative h-fit mt-16">
      <h1>It&apos;s A Match</h1>
      <p>{`${currentUser?.name} & ${matchedUser?.name}`}</p>
      <button
        onClick={() => {
          setConversation(matchedUser._id);
          navigate("/home/chats");
        }}
      >
        Chat Now
      </button>{" "}
      {/*highlighted btn*/}
      <button onClick={() => navigate("/home")}>Go Back</button>{" "}
      {/*understated underlined text*/}
    </div>
  );
};

export default WasAMatch;
