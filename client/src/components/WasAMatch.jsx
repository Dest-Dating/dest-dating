import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const WasAMatch = ({ currentUser, matchedUser, setOpenConvo }) => {
  // use conversations state and check fousers existing in that convo
  console.log(matchedUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const conversations = useSelector(
    (state) => state.conversations.conversations,
  );

  // setting up conversation
  // starting chat with selected user
  const setConversation = async (id) => {
    const selectedConvo = conversations.find((convo) =>
      convo.members.find((userId) => userId === id),
    );
    setOpenConvo(selectedConvo);
  };

  return (
    <div className="flex flex-col w-full col-span-full justify-center items-center relative mt-16 text-white h-[calc(100vh-110px)]">
      <h1>It&apos;s A Match</h1>
      <p>{`${currentUser?.name} & ${matchedUser?.name}`}</p>
      <br />
      <div className="flex ">
        <button
          onClick={() => {
            setConversation(matchedUser._id);
            navigate("/home/chats");
          }}
          className="block m-4 text-white border px-4 py-2 rounded"
        >
          Chat Now
        </button>
        {" "}
        {/*highlighted btn*/}
        <button className="block m-4 text-white border px-4 py-2 rounded"
                onClick={() => navigate("/home")}>Go Back
        </button>
        {" "}
        {/*understated underlined text*/}
      </div>
    </div>
  );
};

export default WasAMatch;
