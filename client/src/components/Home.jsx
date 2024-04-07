import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Conversations from "./HomeScrenComp/Conversations";
import Center from "./HomeScrenComp/Center";
import Likes from "./HomeScrenComp/Likes";
import ChatSection from "./ChatSection";
import { FaBars, FaTimes } from "react-icons/fa";

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="grid grid-cols-12">
      {/* Hamburger Icon for Sidebar */}
      <div className="lg:hidden col-span-1 flex items-center justify-center">
        <button onClick={toggleSidebar} className="text-2xl">
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar for Smaller Screens */}
      {sidebarOpen && (
        <div className="overflow-auto lg:hidden fixed top-0 left-0 h-full w-full md:w-2/3 bg-gray-200 z-50">
          <div className="p-4">
            <button onClick={toggleSidebar} className="text-2xl float-right">
              <FaTimes />
            </button>

            <div className="h-screen flex flex-col">
              <div className="h-1/2 mb-4 overflow-auto">
                <Conversations />
              </div>
              <div className="h-1/2 overflow-auto">
                <Likes />
              </div>
            </div>
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
    </div>
  );
};

export default Home;
