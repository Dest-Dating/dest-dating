import React, { useState } from "react";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import Conversations from "./HomeScrenComp/Conversations";
import Center from "./HomeScrenComp/Center";
import Likes from "./HomeScrenComp/Likes";
import ChatSection from "./ChatSection";

import { FaBars, FaTimes, FaHome } from "react-icons/fa";

import { useDispatch } from "react-redux";
import { logOut } from "../redux/userSlice";


const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleHomeClick = () => {
    navigate("/home");
  };

  return (
    <div className="grid grid-cols-12">
      {/* Top Bar */}
      <div className="col-span-12 bg-gray-200 p-4 flex justify-between items-center">
        {/* Home Icon */}
        <button onClick={handleHomeClick} className="text-2xl">
          <FaHome />
        </button>

        {/* Hamburger Icon for Sidebar (only visible on smaller screens) */}
        <div className="lg:hidden">
          <button onClick={toggleSidebar} className="text-2xl">
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
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

      <div className="col-span-12 lg:col-span-6">
        <button onClick={() => dispatch(logOut())}>logout</button>

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
