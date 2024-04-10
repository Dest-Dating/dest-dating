import { useState, useEffect } from "react";
import registerImage from "../assets/register.svg";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { googleAuthInitiator } from "../utils/googleOAuth";
import OtpSection from "./OtpSection";
import { signup } from "../redux/apiCalls/apiCalls";
import PasswordInput from "./utilComponents/passwordInput.jsx";

function Register() {
  const [email, setEmail] = useState("j87iuasdf8@gmail.com");
  const [password, setPassword] = useState("123qwe!@#");
  const [verifyPassword, setVerifyPassword] = useState("123qwe!@#");
  const [phoneNumber, setPhoneNumber] = useState("1234567891");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [registered, setRegistered] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(
    (state) => state?.user?.currentUser?.data?.user
  );
  useEffect(() => {
    // Once the component mounts or email/password changes, set imageLoaded to true to trigger the fade-in effect
    setImageLoaded(true);
  }, [email, password]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePhoneChnage = (e) => {
    setPhoneNumber(e.target.value);
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
    signup(dispatch, setRegistered, {
      email: email,
      password: password,
      passwordConfirm: verifyPassword,
      phoneNumber: phoneNumber,
    });
    setRegistered(true);
  };

  useEffect(() => {
    if (currentUser) {
      if (currentUser.isSignupCompleted) {
        console.log("./home");
        navigate("/home");
      } else {
        console.log("./questions");
        navigate("/questions");
      }
    }
  }, [currentUser, navigate]);

  return (
    <div>
      {!registered && (
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
                <div className="mb-4">
                  <label
                    htmlFor="phone"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="number"
                    id="phone"
                    value={phoneNumber}
                    onChange={handlePhoneChnage}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-pink-500"
                    placeholder="Enter your phone number"
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
                  <PasswordInput
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
                  <PasswordInput
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
                <button
                  className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
                  onClick={(e) => {
                    googleAuthInitiator(e);
                  }}
                >
                  Google Sign in
                </button>
              </form>
              {/* Google Sign-In Button */}
            </div>
          </div>
        </div>
      )}
      {/* Render component after registration */}
      {registered && (
        <OtpSection
          user={{
            email: email,
          }}
        />
      )}
    </div>
  );
}

export default Register;
