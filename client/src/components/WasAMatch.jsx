import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";


const WasAMatch = ({ currentUser, matchedUser, setOpenConvo }) => {
  // use conversations state and check fousers existing in that convo
  console.log(matchedUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const conversations = useSelector((state) => state.conversations.conversations);

  // setting up conversation
  // starting chat with selected user
  const setConversation = async (id) => {
    const selectedConvo = conversations.find((convo) => convo.members.find((userId) => userId === id));
    setOpenConvo(selectedConvo);
  };

  return (<div
    className="flex relative bg-blue-400 bg-no-repeat bg-cover flex-col w-full col-span-full justify-center items-center text-white h-[calc(100vh-100px)]">
    <h1 className="text-lg text-bold underline mb-10">It&apos;s A Match</h1>
    <span className="inline text-3xl font-handwritten">{`${currentUser?.name}`}</span>
    <span>&</span>
    <span className="inline text-3xl font-handwritten">{`${matchedUser?.name}`}</span>
    <br />
    <div className="flex ">
      <button
        onClick={async () => {
          await setConversation(matchedUser._id);
          navigate("/home/chats");
        }}
        className="block m-4 text-white border px-4 py-2 rounded"
      >
        Chat Now
      </button>

      {/*highlighted btn*/}
      <button className="block m-4 text-white border px-4 py-2 rounded"
              onClick={() => navigate("/home")}>Go Back
      </button>
      {" "}
      {/*understated underlined text*/}
    </div>
    <img
      src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWRlMnlvNGIwa3ozOW50OGlpM254bWFreDc5a25jeGd4dGtodzZpbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/wjIDrGKbvuGxW/giphy.gif"
      alt="" />
  </div>);
};

export default WasAMatch;
