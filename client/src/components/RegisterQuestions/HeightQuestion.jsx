import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from "react-redux";
import { logOut } from "../../redux/userSlice";
import { toast } from "react-toastify";

const HeightQuestion = ({
                          currentStage, setCurrentStage, userData, setUserData,
                        }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500); // Adjust the delay time as needed

    return () => clearTimeout(timer);
  }, []); // Run only once on component mount

  const nextHandler = (e) => {
    e.preventDefault();
    if (!userData.height) {
      setMessage("Enter your height!");
      return;
    }
    setCurrentStage(currentStage + 1);
  };

  return (<div>
    <div className="flex justify-center items-center min-h-screen bg-pink-50">
      <div
        className={`p-4 bg-white rounded-lg shadow-md w-full lg:w-1/2 h-1/3 transform duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`}
      >
        <form onSubmit={nextHandler} className="w-full p-4  flex flex-col justify-center items-center">
          <h2 className="text-lg font-bold mb-4 self-start">Enter your height in cm</h2>
          <div className="text-red-700 m-1 font-medium" style={{ alignSelf: "self-start" }}>{message}</div>
          <input
            type="number"
            name="height"
            min="54"
            max="275"
            value={userData.height}
            autoFocus
            onChange={(e) => setUserData({ ...userData, [e.target.name]: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-pink-500 mb-4"
            placeholder="Enter your name"
          />
          <div className="flex gap-20">
            <span className="underline text-blue-400" onClick={() => dispatch(logOut())}>Logout</span>

            <button
              type="submit"
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
        </form>
      </div>
    </div>
  </div>);
};

export default HeightQuestion;
