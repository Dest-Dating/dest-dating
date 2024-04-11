import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import { googleAuthInitiator } from "../utils/googleOAuth";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/apiCalls/apiCalls";
import PasswordInput from "./utilComponents/passwordInput.jsx";

import sideImage from "../assets/frontPageImage.png";
import { FaGoogle } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verified, setVerified] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(
    (state) => state?.user?.currentUser?.data?.user
  );

  useEffect(() => {
    if (currentUser) {
      if (currentUser?.isSignupCompleted) navigate("/home");
      else navigate("/questions");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    // Once the component mounts or email/password changes, set imageLoaded to true to trigger the fade-in effect
    setImageLoaded(true);
  }, [email, password]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Email:", email);
    console.log("Password:", password);

    // Reset form fields
    await login(dispatch, { loginField: email, password: password });
  };

  return (
    <div className="flex h-screen justify-center items-center bg-rose-50">
      <div
        className="flex justify-evenly
       items-center w-full gap-10 align-middle h-full"
      >
        {/* Left side: Image */}

        <div
          className={`w-[40%] sm:flex p-4 bg-white shadow-md border rounded-lg hidden items-center justify-center overflow-hidden h-full ${
            imageLoaded
              ? "opacity-100 transition-opacity duration-1000"
              : "opacity-0"
          }`}
        >
          <img
            src={sideImage}
            alt="Love"
            // className="h-[100%]"
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        {/* Right side: Login form */}
        <div className="bg-white rounded-lg shadow-md lg:w-[30%] sm:w-fit p-10">
          <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block  text-lg mb-1 font-medium text-gray-900 dark:text-white"
              >
                Your email or phone number
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Email or phone number"
                required
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="password"
                className="block mb-1 text-lg font-medium text-gray-900 dark:text-white"
              >
                Your password
              </label>
              <PasswordInput
                type="password"
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <div
              onClick={() => {
                navigate("/register");
              }}
            >
              Not registered?{" "}
              <span className="text-blue-500 underline cursor-pointer">
                click here
              </span>
            </div>

            <button
              type="submit"
              className="text-white my-3 bg-rose-400 mr-3 hover:bg-rose-500 focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>

            <button
              type="button"
              className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center  me-2 mb-2"
              onClick={(e) => {
                googleAuthInitiator(e);
              }}
            >
              <FaGoogle className="mr-3" />
              Sign in with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
