/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";

const UserInfoForm = ({
  currentStage,
  setCurrentStage,
  userData,
  setUserData,
}) => {
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500); // Adjust the delay time as needed

    return () => clearTimeout(timer);
  }, []); // Run only once on component mount

  const nextHandler = (e) => {
    setCurrentStage(currentStage + 1);
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
          <h2 className="text-lg font-bold mb-4">What should we call you?</h2>
          <input
            type="text"
            name="name"
            onChange={(e) =>
              setUserData({ ...userData, [e.target.name]: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-pink-500 mb-4"
            placeholder="Enter your name"
          />
          <button
            onClick={nextHandler}
            className="flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded"
          >
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInfoForm;
