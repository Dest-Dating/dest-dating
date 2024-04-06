import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Conversations from "./HomeScrenComp/Conversations";
import Center from "./HomeScrenComp/Center";
import Likes from "./HomeScrenComp/Likes";
import ChatSection from "./ChatSection";

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="grid grid-cols-12">
      {/* Left Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden col-span-12">
          {/* Content for the left sidebar */}
          {/* Replace with your content */}
          <div className="p-4 bg-gray-200">
            <h2 className="text-lg font-bold mb-4">Left Sidebar</h2>
            {/* Your left sidebar content here */}
          </div>
        </div>
      )}

      {/* Conversations Section */}
      <div className="lg:col-span-3 hidden lg:block">
        <Conversations />
      </div>

      {/* Center Section */}
      <div className="lg:col-span-6">
        <Routes>
          <Route path="/" element={<Center />} />
          <Route path="/chats" element={<ChatSection />} />
        </Routes>
      </div>

      {/* Likes Section */}
      <div className="lg:col-span-3 hidden lg:block">
        <Likes />
      </div>

      {/* Right Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden col-span-12">
          {/* Content for the right sidebar */}
          {/* Replace with your content */}
          <div className="p-4 bg-gray-200">
            <h2 className="text-lg font-bold mb-4">Right Sidebar</h2>
            {/* Your right sidebar content here */}
          </div>
        </div>
      )}

      {/* Button to toggle sidebar */}
      <button
        className="fixed bottom-4 right-4 bg-pink-500 text-white px-4 py-2 rounded-full lg:hidden"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
      </button>
    </div>
  );
};

export default Home;
