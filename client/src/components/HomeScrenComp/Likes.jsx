import React from "react";

const Likes = () => {
  // Dummy liked user data
  const likedUsers = [
    {
      id: 1,
      userImage: "https://via.placeholder.com/50",
      username: "Alice",
    },
    {
      id: 2,
      userImage: "https://via.placeholder.com/50",
      username: "Bob",
    },
    // Add more liked user data as needed
  ];

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md h-screen">
      <h2 className="text-lg font-bold mb-4">Liked Users</h2>
      {/* Mapping over likedUsers array to render each liked user */}
      {likedUsers.map((user) => (
        <div key={user.id} className="flex items-center mb-4">
          {/* User Image */}
          <img
            src={user.userImage}
            alt="User"
            className="w-12 h-12 rounded-full mr-4"
          />
          {/* Username */}
          <div>
            <h3 className="text-lg font-semibold">{user.username}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Likes;
