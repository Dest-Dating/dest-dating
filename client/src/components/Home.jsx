import React, { useEffect, useRef, useState } from "react";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import Conversations from "./HomeScrenComp/Conversations";
import Center from "./HomeScrenComp/Center";
import Likes from "./HomeScrenComp/Likes";
import ChatSection from "./ChatSection";
import { io } from "socket.io-client";

import { FaBars, FaTimes, FaHome, FaUser, FaSignOutAlt } from "react-icons/fa";

import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { logoutUser } from "../redux/apiCalls/apiCalls";

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentUser = useSelector(
    (state) => state?.user?.currentUser?.data?.user
  );

  //messages code
  const [chatUsers, setChatUsers] = useState([]);
  const [openConvo, setOpenConvo] = useState(null);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const socket = useRef();

  useEffect(() => {
    socket.current = io("http://localhost:4000", {
      transports: ["websocket"],
    });

    socket.current.on("getMessage", (data) =>
      setArrivalMessage({
        senderId: data.senderId,
        message: data.message,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.current.emit("addUser", currentUser._id);
    socket.current.on("getUsers", (users) => console.log(users));
  }, [currentUser]);

  // -----------------------------
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleHomeClick = () => {
    navigate("/home");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    logoutUser(dispatch);
  };

  return (
    <div className="grid grid-cols-12">
      {/* Top Bar */}
      <div className="col-span-12 bg-gray-200 p-4 flex justify-between items-center">
        {/* Home Icon */}
        <button onClick={handleHomeClick} className="text-2xl">
          <FaHome />
        </button>

        {/* Profile Icon */}
        <button onClick={handleProfileClick} className="text-2xl mx-4">
          <FaUser />
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded-full"
        >
          <FaSignOutAlt />
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
                <Conversations
                  chatUsers={chatUsers}
                  setChatUsers={setChatUsers}
                  setOpenConvo={setOpenConvo}
                />
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
        <Conversations
          chatUsers={chatUsers}
          setChatUsers={setChatUsers}
          setOpenConvo={setOpenConvo}
        />
      </div>

      {/* Center Section */}
      <div className="col-span-12 lg:col-span-6">
        <Routes>
          <Route path="/" element={<Center />} />
          <Route
            path="/chats"
            element={
              <ChatSection
                chatUsers={chatUsers}
                arrivalMessage={arrivalMessage}
                socket={socket}
                openConvo={openConvo}
                setOpenConvo={setOpenConvo}
              />
            }
          />
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
