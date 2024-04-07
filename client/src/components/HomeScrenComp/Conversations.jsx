import React from "react";

const Conversations = () => {
  // Dummy conversation data
  const conversations = [
    {
      id: 1,
      profilePicture: "https://via.placeholder.com/50",
      name: "John Doe",
      latestMessage: "Hey there!",
    },
    {
      id: 2,
      profilePicture: "https://via.placeholder.com/50",
      name: "Jane Smith",
      latestMessage: "How are you?",
    },
    // Add more conversation data as needed
  ];

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md h-screen">
      <h2 className="text-lg font-bold mb-4">Conversations</h2>
      {/* Mapping over conversations array to render each conversation */}
      {conversations.map((conversation) => (
        <div key={conversation.id} className="flex items-center mb-4">
          {/* Profile Picture */}
          <img
            src={conversation.profilePicture}
            alt="Profile"
            className="w-12 h-12 rounded-full mr-4"
          />
          {/* Name and Latest Message */}
          <div>
            <h3 className="text-lg font-semibold">{conversation.name}</h3>
            <p className="text-gray-500">{conversation.latestMessage}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Conversations;
