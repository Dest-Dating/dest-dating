import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { publicRequest } from "../requestMethods";
import { useSocket } from "../context/SocketProvider";
import { IoMdSend } from "react-icons/io";
import { FaVideo } from "react-icons/fa";
import { MdMovie } from "react-icons/md";

const ChatSection = ({
                       chatUsers,
                       arrivalMessage,
                       socket,
                       openConvo,
                       setOpenConvo,
                       setMatchedUser,
                     }) => {
  const currentUser = useSelector(
    (state) => state?.user?.currentUser?.data?.user
  );
  const reciver = chatUsers.find((user) =>
    openConvo?.members?.find((id) => id === user.userId)
  );
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef(null);
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const [error, setError] = useState("");
  const [movieDate, setMovieDate] = useState(true);

  const socketForVideo = useSocket(); // Get the socket object from context
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  // Function to handle form submission
  const handleSubmitForm = useCallback(() => {
    // setRoom(currentUser?._id);
    // e.preventDefault();
    if (!currentUser?._id) {
      setError("Please fill in all fields.");
      return;
    }
    // Emit an event to join a room with email and room data.
    socketForVideo.emit("room:join", {
      email: currentUser?._id,
      room:
        currentUser?._id < reciver?.userId
          ? `${currentUser?._id}${reciver?.userId}`
          : `${reciver?.userId}${currentUser._id}`,
    });
  }, [currentUser?._id, reciver?.userId, socketForVideo]);

  // Function to handle joining a room
  const handleJoinRoom = useCallback(
    (data) => {
      const { room: roomId } = data;
      // Navigate to the specified room
      // alert(movieDate);
      navigate(`/room/${roomId}`, { state: { movieDate } });
    },
    [movieDate, navigate]
  );

  // Effect to listen for room join event
  useEffect(() => {
    socketForVideo.on("room:join", handleJoinRoom);
    // Cleanup
    return () => {
      socketForVideo.off("room:join", handleJoinRoom);
    };
  }, [socketForVideo, handleJoinRoom]);

  // send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage === "") return;

    const messageData = {
      message: newMessage,
      senderId: currentUser._id,
      conversationId: openConvo?._id,
    };

    socket.current.emit("sendMessage", {
      reciverId: reciver?.userId,
      senderId: currentUser._id,
      message: newMessage,
    });

    try {
      await publicRequest.post(`message/`, messageData);

      setMessages([...messages, messageData]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    arrivalMessage &&
    openConvo?.members.includes(arrivalMessage.senderId) &&
    setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, openConvo]);

  // fetch old messages
  const fetchMessages = async () => {
    try {
      const { data } = await publicRequest.get(`message/${openConvo._id}`);
      setMessages(data);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    (async () => {
      await fetchMessages();
    })();
  }, [openConvo]);

  // scroll to current message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <div className="h-[calc(100vh-50px)] flex flex-col  bg-stone-50">
      {/* Top Bar */}
      <div className="bg-gray-200 p-4 shadow-lg flex justify-between items-center">
        <div className="flex items-center">
          <img
            src={reciver?.profilePicture.photoLink}
            alt="Reciver Image"
            className="w-8 h-8 rounded-full mr-2"
          />
          <span className="text-lg font-bold">{reciver?.name}</span>
        </div>
        <div>
          <button
            onClick={() => {
              setMovieDate(false);
              handleSubmitForm();
            }}
            className="border shadow-sm hover:shadow-xl transition  px-6 py-2 text-xl text-white bg-rose-400 rounded"
          >
            <FaVideo />
          </button>
          <button
            onClick={() => {
              setMovieDate(true);
              handleSubmitForm();
            }}
            className="border shadow-sm hover:shadow-xl transition  px-6 py-2 text-xl text-white bg-rose-400 rounded ml-6"
          >
            <MdMovie />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto px-4 py-2 text-lg *:transition">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.senderId === currentUser._id
                ? "justify-end"
                : "justify-start"
            } mb-2`}
            ref={scrollRef}
          >
            {/*ye message hmne bheje h*/}
            {message.senderId === currentUser._id && (
              <div className="chat max-w-[50%] chat-end">
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      src={currentUser?.photosLink[0]?.photoLink}
                      className="shadow-sm"
                    />
                  </div>
                </div>
                <div className="chat-bubble shadow-sm bg-rose-300 text-black">
                  {message.message}
                </div>
              </div>
            )}

            {/*ye message _setting_ ke side se aay h*/}
            {message.senderId !== currentUser._id && (
              <div className="chat max-w-[50%] chat-start">
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      src={reciver?.profilePicture.photoLink}
                      className="shadow-sm"
                    />
                  </div>
                </div>
                <div className="chat-bubble  shadow-sm bg-rose-400 text-black">
                  {message.message}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Bottom Bar */}
      <form
        onSubmit={(e) => sendMessage(e)}
        className="p-4 bg-gray-200 flex items-center"
      >
        <input
          type="text"
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
          className="flex-grow border border-gray-300 rounded-l-md p-2 focus:outline-none mr-2"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="bg-rose-400 text-white rounded-r-md p-2 h-full px-4 focus:outline-none"
        >
          <IoMdSend size={30} />
        </button>
      </form>
    </div>
  );
};

export default ChatSection;
