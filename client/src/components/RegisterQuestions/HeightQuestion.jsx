import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from "react-redux";
import { logOut } from "../../redux/userSlice";
import { toast } from "react-toastify";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const HeightQuestion = ({
  currentStage,
  setCurrentStage,
  userData,
  setUserData,
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

  return (
    <div>
      <div className="flex justify-center items-center min-h-screen bg-rose-50">
        <div
          className={`p-4 bg-white rounded-lg shadow-md w-full lg:w-1/2 h-1/3 transform duration-500 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          <form
            onSubmit={nextHandler}
            className="w-full p-4  flex flex-col justify-center items-center"
          >
            <h2 className="text-lg font-bold mb-4 self-start">
              Enter your height in cm
            </h2>
            <div
              className="text-red-700 m-1 font-medium"
              style={{ alignSelf: "self-start" }}
            >
              {message}
            </div>
            <input
              type="number"
              name="height"
              min="54"
              max="275"
              value={userData.height}
              autoFocus
              onChange={(e) =>
                setUserData({ ...userData, [e.target.name]: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-rose-500 mb-4"
              placeholder="Enter your height"
            />
            <div className="flex gap-20">
              <button
                onClick={() => setCurrentStage(currentStage - 1)}
                className="flex items-center justify-center bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded "
              >
                <IoIosArrowBack />
                Back
              </button>

              <button
                type="submit"
                className="flex items-center justify-center bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded"
              >
                Next
                <IoIosArrowForward />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HeightQuestion;
