import "./App.css";
import { userRequest } from "./requestMethods";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile2";

function App() {
  // user data of currently logged in user from redux state
  const currentUser = useSelector((state) => state?.user?.currentUser);

  // Setting authorization header for user request
  userRequest.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${currentUser?.token}`;

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/home/*" element={<Home />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
      </Routes>
    </>
  );
}

export default App;
