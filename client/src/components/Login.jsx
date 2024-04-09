import React, { useState, useEffect } from "react";
import loginImage from "../assets/login_page.svg";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import { googleAuthInitiator } from "../utils/googleOAuth";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/apiCalls/apiCalls";
import PasswordInput from "./utilComponents/PasswordInput.jsx";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Email:", email);
    console.log("Password:", password);

    // Reset form fields
    login(dispatch, { loginField: email, password: password });
    setEmail("");
    setPassword("");
  };

  return (
    <div className="flex h-screen justify-center items-center bg-violet-100">
      <div className="max-w-xl w-full flex justify-between">
        {/* Left side: Image */}
        <div
          className={`hidden lg:block w-4/5 ${
            imageLoaded
              ? "opacity-100 transition-opacity duration-1000"
              : "opacity-0"
          }`}
        >
          <img
            src={loginImage}
            alt="Love"
            className="h-80 w-80"
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        {/* Right side: Login form */}
        <div className="bg-white rounded-lg shadow-md w-full p-10">
          <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block  text-lg mb-2 font-medium text-gray-900 dark:text-white"
              >
                Your email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@flowbite.com"
                required
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="password"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
              >
                Your password
              </label>
              <PasswordInput
                type="password"
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <div
              onClick={() => {
                navigate("/register");
              }}
              className="text-blue"
            >
              Not registered? click here
            </div>

            <button
              type="submit"
              className="text-white my-3 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
              <svg
                className="w-4 h-4 me-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 18 19"
              >
                <path
                  fillRule="evenodd"
                  d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
                  clipRule="evenodd"
                />
              </svg>
              Sign in with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
