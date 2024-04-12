import "./App.css";
import { publicRequest, userRequest } from "./requestMethods";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import QuestionsPage from "./components/QuestionsPage";
import { ToastContainer } from "react-toastify";
import AuthCompletePage from "./components/AuthCompletePage";
import BuyPremium from "./components/BuyPreium";
import PaymentSucess from "./components/PaymentSuccess";
import PaymentFailure from "./components/PaymentFailure";
import Lobby from "./screens/Lobby";
import RoomPage from "./screens/RoomPage";
import Profile2 from "./components/Profile2";
import Test from "./components/Test.jsx";
import NotFoundPage from "./components/NotFoundPage.jsx";
import ResetPassword from "./components/ProfileComponents/ResetPassword.jsx";
import ChangePassword from "./components/ProfileComponents/ChangePassword.jsx";
import DeleteAccount from "./components/ProfileComponents/DeleteAccount.jsx";
import Preferences from "./components/Preferences.jsx";

function App() {
  // user data of currently logged in user from redux state
  const currentUser = useSelector((state) => state?.user?.currentUser);

  // Setting authorization header for user request
  // publicRequest.defaults.headers.common[
  //   "Authorization"
  // ] = `Bearer ${currentUser?.token}`;

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/resetpassword" element={<ResetPassword />}></Route>
        <Route path="/resetpassword/:id" element={<ChangePassword />}></Route>
        <Route path="/questions" element={<QuestionsPage />}></Route>
        <Route
          path="/profile/deleteaccount"
          element={<DeleteAccount />}
        ></Route>
        <Route path="/home/*" element={<Home />}></Route>
        <Route path="/profile" element={<Profile2 />}></Route>
        <Route path="/getPremium" element={<BuyPremium />}></Route>
        <Route path="/paymentSuccess" element={<PaymentSucess />}></Route>
        <Route path="/paymentFailed" element={<PaymentFailure />}></Route>
        <Route path="/authComplete" element={<AuthCompletePage />}></Route>
        <Route path="/lobby" element={<Lobby />}></Route>
        <Route path="/room/:roomId" element={<RoomPage />}></Route>
        <Route path="/test" element={<Test />}></Route>
        <Route path="/preferences" element={<Preferences />}></Route>
        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
    </>
  );
}

export default App;
