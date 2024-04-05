import React from "react";
import { Route, Routes } from "react-router-dom";
import Conversations from "./HomeScrenComp/Conversations";
import Center from "./HomeScrenComp/Center";
import Likes from "./HomeScrenComp/Likes";

const Home = () => {
  return (
    <div>
      <Conversations />
      <Routes>
        <Route path="/" element={<Center />}></Route>
      </Routes>
      <Likes />
    </div>
  );
};

export default Home;
