import React, { useEffect, useRef, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Conversations from "./HomeScrenComp/Conversations";
import Center from "./HomeScrenComp/Center";
import ChatSection from "./ChatSection";
import { io } from "socket.io-client";

import { FaBars, FaTimes } from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import {
  getMe,
  likeUser,
  logoutUser,
  rejectUser,
  updateLocation,
} from "../redux/apiCalls/apiCalls";
import { publicRequest } from "../requestMethods";
import WasAMatch from "./WasAMatch";
import logo from "../assets/destDating.ico";
import { toast } from "react-toastify";

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentUser = useSelector(
    (state) => state?.user?.currentUser?.data?.user
  );
  const completeUser = useSelector((state) => state?.user?.currentUser);

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
    socket.current.emit("addUser", currentUser?._id);
    socket.current.on("getUsers", (users) => console.log(users));
  }, [currentUser]);

  // chat mssages end-------------

  // match controls
  const [matchedUser, setMatchedUser] = useState(null);
  const [preferredUsers, setPreferredUsers] = useState([]);

  const handleLike = async () => {
    const status = await likeUser(
      dispatch,
      preferredUsers[0]?.email,
      currentUser,
      setMatchedUser,
      navigate
    );
    await getPreferredUsers();
  };
  const handleReject = async () => {
    await rejectUser(dispatch, preferredUsers[0]?.email, currentUser);
    await getPreferredUsers();
  };

  const getPreferredUsers = async () => {
    const res = await publicRequest.post("/user/getRecommendations");
    setPreferredUsers(res?.data?.recommendations);
    // console.log(res?.data?.recommendations[0]);
  };
  useEffect(() => {
    (async () => {
      await getPreferredUsers();
    })();
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


  const handleLogout = async () => {
    await logoutUser(dispatch, navigate);
  };

  // update user's location

  const getLocation = async () => {
    // eslint-disable-next-line no-undef
    if (navigator.geolocation) {
      // eslint-disable-next-line no-undef
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          updateLocation(dispatch, [longitude, latitude], completeUser);
        },
        (error) => console.log(error)
      );
    } else {
      console.log("Geolocation not supported");
    }
  };

  useEffect(() => {
    getMe();
    getLocation();
  }, []);

  return (
    <div className="grid grid-cols-12">

      {/* Top Bar */}
      <div className="col-span-12 h-24 bg-stone-50 shadow-xl flex px-6 lg:px-20 justify-between items-center">
        {/* Home Icon */}
        <button className="h-full" onClick={handleHomeClick}>
          <img className="h-full  mix-blend-multiply" src={logo} alt="" />
        </button>

        <div className="flex gap-5">
          {/* Profile Icon */}
          <button onClick={handleProfileClick} className="text-xl">
            Profile
          </button>

          {/* Logout Button */}
          <button onClick={handleLogout} className="text-xl">
            Logout
          </button>
        </div>

        {/* Hamburger Icon for Sidebar (only visible on smaller screens) */}
        <div className="lg:hidden">
          <button onClick={toggleSidebar} className="text-2xl">
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/*????????????????? what is this ??????????????????*/}
      {/*<button onClick={() => navigate("/home/match")}>match</button>*/}

      {/* Sidebar for Smaller Screens */}
      {sidebarOpen && (
        <div className="overflow-auto absolute top-[49px] z-10 lg:hidden md:col-span-5 bg-gray-200">
          <div className="p-4">
            <button onClick={toggleSidebar} className="text-2xl float-right">
              <FaTimes />
            </button>

            <div className="h-screen flex flex-col">
              <div className="h-full mb-4 overflow-auto">
                <Conversations
                  chatUsers={chatUsers}
                  setChatUsers={setChatUsers}
                  setOpenConvo={setOpenConvo}
                  matchedUser={matchedUser}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conversations Section */}
      <div className="lg:col-span-2 hidden lg:block">
        <Conversations
          chatUsers={chatUsers}
          setChatUsers={setChatUsers}
          setOpenConvo={setOpenConvo}
          matchedUser={matchedUser}
        />
      </div>

      {/* Center Section */}
      <div className="col-span-12 lg:col-span-10 w-full min-h-[calc(100vh-50px)] bg-blue-400">
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
                <div className="flex justify-center items-center h-full">
                  <div>
                    <h3 className="text-white underline mb-2">
                      No Recommendations
                    </h3>
                    <p className="text-stone-300">
                      Please try again after some time or change preferences!
                    </p>
                  </div>
                </div>
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
    </div>
  );
};

export default Home;
