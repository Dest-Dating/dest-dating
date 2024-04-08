import React, { useState, useEffect } from "react";
import registerImage from "../assets/register.svg";
import { useNavigate } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import NecessaryQuestions from "./NecessaryQuestions";
import "react-toastify/dist/ReactToastify.css";
import { googleAuthInitiator } from "../utils/googleOAuth";
import OTPInput from "./RegisterQuestions/OTPInput";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [verified, setVerified] = useState(false);
  const [OTPEntered, setOTPEntered] = useState(false);
  const navigate = useNavigate();

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

  const handleVerifyPasswordChange = (e) => {
    setVerifyPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== verifyPassword) {
      // alert("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }
    // Handle registration logic here
    console.log("Email:", email);
    console.log("Password:", password);
    setOTPEntered(true);
    // setVerified(true);
  };

  const responseGoogle = (response) => {
    console.log(response);
    // Handle Google Sign-In logic here
  };

  return (
    <div>
      {!verified && !OTPEntered && (
        <div className="flex h-screen justify-center items-center bg-pink-100">
          <div className="max-w-xl w-full flex justify-between items-center">
            {/* Left side: Image */}
            <div
              className={`hidden lg:block w-4/5 ${
                imageLoaded
                  ? "opacity-100 transition-opacity duration-1000"
                  : "opacity-0"
              }`}
            >
              <img
                src={registerImage}
                alt="Love"
                className="h-80 w-80"
                onLoad={() => setImageLoaded(true)}
              />
            </div>

            {/* Right side: Registration form */}
            <div className="bg-white  rounded-lg shadow-md w-full lg:w-4/5">
              <form
                onSubmit={handleSubmit}
                className="bg-white p-10 rounded-lg w-full lg:w-full"
              >
                <h2 className="text-3xl mb-4 text-center font-bold">
                  Hey there👋
                </h2>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-pink-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="password"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-pink-500"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="verifyPassword"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="verifyPassword"
                    value={verifyPassword}
                    onChange={handleVerifyPasswordChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-pink-500"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
                <div
                  onClick={() => {
                    navigate("/");
                  }}
                  className="mb-2 text-center cursor-pointer text-blue-500"
                >
                  Already registered? Click here to sign in
                </div>
                <button
                  type="submit"
                  className="w-full bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
                >
                  Register
                </button>
                {/* Custom oAuth */}

                {/* Google Sign-In Button */}
                <ToastContainer />
              </form>
              <button
                className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
                onClick={(e) => {
                  googleAuthInitiator(e);
                }}
              >
                Google Sign in
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Render component after registration */}
      {!verified && OTPEntered && (
        <OTPInput verified={verified} setVerified={setVerified} />
      )}
      {verified && <NecessaryQuestions />}
    </div>
  );
}

export default Register;
