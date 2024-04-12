import React, { useState, useRef, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OTPInput = ({ verified, setVerified }) => {
  const [otp, setOTP] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setFadeIn(true);
    }, 100);
  }, []);

  const handleChange = (index, event) => {
    const value = event.target.value;
    if (value.length <= 1) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOTP(newOTP);

      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData("text");
    const pasteOTP = pasteData.split("").slice(0, otp.length);
    const newOTP = [...otp];
    pasteOTP.forEach((value, index) => {
      newOTP[index] = value;
    });
    setOTP(newOTP);
  };

  const handleBackspace = (index, event) => {
    if (event.key === "Backspace" && index > 0 && !otp[index]) {
      const newOTP = [...otp];
      newOTP[index - 1] = "";
      setOTP(newOTP);
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = () => {
    const enteredOTP = otp.join("");
    // Here you can add your logic to verify the OTP
    if (enteredOTP === "123456") {
      setVerified(true);
    } else {
      toast.error("OTP does not match");
      setVerified(false);

      // Handle incorrect OTP
    }
  };

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div
        className={`flex flex-col items-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
          fadeIn ? "opacity-100" : "opacity-0"
        } transition-opacity duration-500`}
      >
        <h2 className="text-lg font-bold mb-4">ENTER OTP</h2>
        <div className="flex justify-center items-center">
          {otp.map((value, index) => (
            <input
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              className="w-12 h-12 border border-gray-300 rounded-md text-center text-lg mx-2 outline-none focus:border-blue-500"
              type="text"
              maxLength="1"
              value={value}
              onChange={(e) => handleChange(index, e)}
              onPaste={handlePaste}
              onKeyDown={(e) => handleBackspace(index, e)}
            />
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="mt-4 bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
        {/* Render ToastContainer separately */}
      </div>
    </div>
  );
};

export default OTPInput;
