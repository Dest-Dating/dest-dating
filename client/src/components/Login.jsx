import React, { useState, useEffect } from "react";
import loginImage from "../assets/login_page.svg";
import { useNavigate } from "react-router-dom";
import { googleAuthInitiator } from "../utils/googleOAuth";
import { useSelector } from "react-redux";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();
  const currentUser = useSelector(
    (state) => state?.user?.currentUser?.data?.user
  );

  useEffect(() => {
    if (currentUser) {
      if (currentUser.isSignupCompleted) navigate("/home");
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
    setEmail("");
    setPassword("");
  };

  return (
    <div className="flex h-screen justify-center items-center bg-pink-100">
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
        <div className="bg-white rounded-lg shadow-md w-full lg:w-4/5">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-10 rounded-lg  w-full lg:w-full"
          >
            <h2 className="text-3xl mb-4 text-center font-bold">Hey there👋</h2>
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
            <div
              onClick={() => {
                navigate("/register");
              }}
            >
              not registered? click here
            </div>
            <button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Log In
            </button>
            {/* Google auth Button */}
            <button
              className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
              onClick={(e) => {
                googleAuthInitiator(e);
              }}
            >
              Google login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
