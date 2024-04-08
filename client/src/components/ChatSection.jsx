import React, { useState, useRef, useEffect } from "react";

const ChatSection = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const chatEndRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim() !== "") {
      const newMessage = {
        text: inputText,
        sender: "Me", // Change it dynamically based on sender or receiver
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputText("");
    }
  };

  useEffect(() => {
    chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen flex flex-col bg-pink-100">
      {/* Top Bar */}
      <div className="bg-gray-200 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <img
            src="https://via.placeholder.com/50" // Dummy profile picture
            alt="Profile"
            className="w-8 h-8 rounded-full mr-2"
          />
          <span className="text-lg font-bold">Receiver's Username</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto px-4 py-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === "Me" ? "justify-end" : "justify-start"
            } mb-2`}
          >
            {message.sender !== "Me" && (
              <img
                src="https://via.placeholder.com/50" // Dummy profile picture
                alt="Receiver"
                className="w-8 h-8 rounded-full mr-2"
              />
            )}
            <div
              className={`p-2 rounded-lg ${
                message.sender === "Me"
                  ? "bg-pink-500 text-white self-end"
                  : "bg-pink-300 self-start"
              }`}
            >
              {message.text}
              <div className="text-xs text-gray-500">{message.timestamp}</div>
            </div>
            {message.sender === "Me" && (
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
        onSubmit={handleSubmit}
        className="p-4 bg-gray-200 flex items-center"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
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
