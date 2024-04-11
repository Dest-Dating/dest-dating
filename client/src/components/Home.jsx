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
import { likeUser, logoutUser, rejectUser } from "../redux/apiCalls/apiCalls";
import { publicRequest } from "../requestMethods";
import WasAMatch from "./WasAMatch";

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentUser = useSelector(
    (state) => state?.user?.currentUser?.data?.user
  );

  //chat messages code
  const [chatUsers, setChatUsers] = useState([]);
  const [openConvo, setOpenConvo] = useState(null);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  // chat mssages end-------------

  // match controls
  const [matchedUser, setMatchedUser] = useState(null);
  const [preferredUsers, setPreferredUsers] = useState([]);

  const handleLike = async () => {
    await likeUser(
      dispatch,
      preferredUsers[0]?.email,
      currentUser,
      setMatchedUser,
      navigate
    );
    getPreferredUsers();
  };
  const handleReject = async () => {
    await rejectUser(dispatch, preferredUsers[0]?.email, currentUser);
    getPreferredUsers();
  };

  const getPreferredUsers = async () => {
    const res = await publicRequest.post("/user/getRecommendations");
    setPreferredUsers(res?.data?.recommendations);
    // console.log(res?.data?.recommendations[0]);
  };
  useEffect(() => {
    getPreferredUsers();
  }, []);

  // match controls end-----------

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
    logoutUser(dispatch, navigate);
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
      <button onClick={() => navigate("/home/match")}>match</button>
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
                  matchedUser={matchedUser}
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
          matchedUser={matchedUser}
        />
      </div>

      {/* Center Section */}
      <div className="col-span-12 lg:col-span-6">
        <Routes>
          <Route
            path="/"
            element={
              preferredUsers.length > 0 ? (
                <Center
                  user={preferredUsers[0]}
                  handleLike={handleLike}
                  handleReject={handleReject}
                />
              ) : (
                <>No Recommendations</>
              )
            }
          />
          <Route
            path="/chats"
            element={
              <ChatSection
                chatUsers={chatUsers}
                arrivalMessage={arrivalMessage}
                socket={socket}
                openConvo={openConvo}
                setOpenConvo={setOpenConvo}
                setMatchedUser={setMatchedUser}
              />
            }
          />
          <Route
            path="/match"
            element={
              <WasAMatch
                currentUser={currentUser}
                matchedUser={matchedUser}
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
