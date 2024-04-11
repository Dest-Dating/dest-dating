import React, { useEffect, useState, useRef } from "react";
import { verifyOtp } from "../redux/apiCalls/apiCalls";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const OtpSection = ({ user, back }) => {
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

  const handleSubmit = async () => {
    const enteredOtp = otp.join("");
    if (
      await verifyOtp(dispatch, { ...user, emailVerificationOtp: enteredOtp })
    ) {
      navigate("/questions");
    }
  };

  return (
    <div
      className={`bg-black bg-opacity-50 transition-opacity duration-500 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex justify-center min-h-screen bg-rose-50">
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
                className="w-12 h-12 border border-gray-300 rounded-md text-center text-lg mx-2 outline-none focus:border-rose-500"
                type="text"
                maxLength="1"
                value={value}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleBackspace(index, e)}
              />
            ))}
          </div>
          <div className="flex gap-5 mb-4">
            <button onClick={() => back()} className="underline text-blue-400">
              Change email
            </button>
            <button
              disabled={otpDisabled}
              className={`${otpDisabled ? "text-gray-400" : "text-black"}`}
              onClick={() => setOtpDisabled(true)}
            >
              {/* put timer */}
              {otpDisabled
                ? `You can Resend OTP after 90 seconds`
                : "Resend OTP"}
            </button>
          </div>
          <button
            onClick={handleSubmit}
            className="flex items-center justify-center bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpSection;
