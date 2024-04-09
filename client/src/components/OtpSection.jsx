import React, { useEffect, useState, useRef } from "react";
import { verifyOtp } from "../redux/apiCalls/apiCalls";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const OtpSection = ({ user }) => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [otpDisabled, setOtpDisabled] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const otpBlocks = useRef([]);

  useEffect(() => {
    setTimeout(() => {
      setOtpDisabled(false);
    }, 90000);
  }, [otpDisabled]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500); // Adjust the delay time as needed

    return () => clearTimeout(timer);
  }, []); // Run only once on component mount

  const handleChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpBlocks.current[index + 1].focus();
    }
  };

  const handleBackspace = (index, event) => {
    if (event.key === "Backspace" && index > 0 && !otp[index]) {
      otpBlocks.current[index - 1].focus();
    }
  };

  const handleSubmit = () => {
    const enteredOtp = otp.join("");
    verifyOtp(dispatch, { ...user, emailVerificationOtp: enteredOtp });
    navigate("/questions");
  };

  return (
    <div
      className={`fixed top-0 right-0 bottom-0 left-0 z-50 bg-black bg-opacity-50 transition-opacity duration-500 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex justify-center min-h-screen bg-pink-50">
        <div
          className={`p-4 bg-white mt-10 rounded-lg shadow-md w-full lg:w-1/2 flex flex-col justify-center items-center h-1/3 transition-transform duration-500 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <h2 className="text-lg font-bold mb-4">
            Enter OTP Received your Mail
          </h2>
          <div className="flex justify-center mb-4">
            {otp.map((value, index) => (
              <input
                key={index}
                ref={(ref) => (otpBlocks.current[index] = ref)}
                className="w-12 h-12 border border-gray-300 rounded-md text-center text-lg mx-2 outline-none focus:border-pink-500"
                type="text"
                maxLength="1"
                value={value}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleBackspace(index, e)}
              />
            ))}
          </div>
          <button
            disabled={otpDisabled}
            className={`${otpDisabled ? "text-gray-400" : "text-black"} mb-2`}
            onClick={() => setOtpDisabled(true)}
          >
            {/* put timer */}
            {otpDisabled ? `You can Resend OTP after 90 seconds` : "Resend OTP"}
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpSection;
