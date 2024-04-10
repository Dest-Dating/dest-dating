import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { publicRequest } from "../requestMethods";

const ChatSection = ({
  chatUsers,
  arrivalMessage,
  socket,
  openConvo,
  setOpenConvo,
}) => {
  const currentUser = useSelector(
    (state) => state?.user?.currentUser?.data?.user
  );
  const reciver = chatUsers.find((user) =>
    openConvo?.members?.find((id) => id === user.userId)
  );

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [inputText, setInputText] = useState("");
  const chatEndRef = useRef(null);

  const scrollRef = useRef(null);

  const sendMessage = async (e) => {
    e.preventDefault();

    const messageData = {
      message: newMessage,
      senderId: currentUser._id,
      conversationId: openConvo?._id,
    };

    socket.current.emit("sendMessage", {
      reciverId: reciver.userId,
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
      console.log(data);
      setMessages(data);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openConvo]);

  // scroll to current message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen flex flex-col  bg-pink-100">
      {/* Top Bar */}
      <div className="bg-gray-200 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <img
            src={reciver?.profilePicture?.photoLink} // Dummy profile picture
            alt="Profile"
            className="w-8 h-8 rounded-full mr-2"
          />
          <span className="text-lg font-bold">{reciver?.name}</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto px-4 py-2">
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
            {message.senderId !== currentUser._id && (
              <img
                src="https://via.placeholder.com/50" // Dummy profile picture
                alt="Receiver"
                className="w-8 h-8 rounded-full mr-2"
              />
            )}
            <div
              className={`p-2 rounded-lg ${
                message.senderId === currentUser._id
                  ? "bg-pink-500 text-white self-end"
                  : "bg-pink-300 self-start"
              }`}
            >
              {message.message}
              <div className="text-xs text-gray-500">{message.timestamp}</div>
            </div>
            {message.senderId === currentUser._id && (
              <img
                src="https://via.placeholder.com/50" // Dummy profile picture
                alt="Sender"
                className="w-8 h-8 rounded-full ml-2"
              />
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
          className="bg-pink-500 text-white rounded-r-md p-2 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatSection;
