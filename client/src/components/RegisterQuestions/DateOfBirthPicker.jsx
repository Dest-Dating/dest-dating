import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const DateOfBirthPicker = ({ currentStage, setCurrentStage, setUserData }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500); // Adjust the delay time as needed

    return () => clearTimeout(timer);
  }, []); // Run only once on component mount

  const nextHandler = () => {
    setUserData((p) => ({ ...p, dob: selectedDate }));
    setCurrentStage(currentStage + 1);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-rose-50">
      <div
        className={`p-4 bg-white rounded-lg shadow-md w-full lg:w-1/2 h-1/3 transform duration-500 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`p-4 bg-white rounded-lg w-full  flex flex-col justify-center items-center h-1/3`}
        >
          <h2 className="text-lg font-bold mb-4">Date of Birth</h2>
          <input
            onChange={(e) => setSelectedDate(e.target.value)}
            type="date"
            name="date"
            placeholder="YYYY-MM-DD"
            required
            autoFocus
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-rose-500"
          />
          <div className="flex gap-20 mt-4">
            <span
              onClick={() => setCurrentStage(currentStage - 1)}
              className="flex items-center justify-center bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded mt-2"
            >
              <IoIosArrowBack />
              Back
            </span>
            <button
              type="submit"
              onClick={nextHandler}
              className="flex items-center justify-center bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded mt-2"
            >
              Next
              <IoIosArrowForward />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateOfBirthPicker;
