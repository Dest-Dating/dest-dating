import React, { useState, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const InterestPicker = ({
  currentStage,
  setCurrentStage,
  userData,
  setUserData,
}) => {
  const [selectedInterest, setSelectedInterest] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500); // Adjust the delay time as needed

    return () => clearTimeout(timer);
  }, []); // Run only once on component mount

  const handleGenderSelect = (gender) => {
    setSelectedInterest(gender);
  };

  const nextHandler = (e) => {
    e.preventDefault();
    setUserData({ ...userData, interestedInGender: selectedInterest });
    if (!selectedInterest) {
      setMessage("Select your interests!");
      return;
    }
    setCurrentStage(currentStage + 1);
    // also, add to the object here
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-pink-50">
      <div
        className={`p-4 bg-white rounded-lg shadow-md w-full lg:w-1/2 h-1/3 transform duration-500 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`p-4 bg-white rounded-lg w-full  flex flex-col justify-center items-center h-1/3`}
        >
          <h2 className="text-lg font-bold mb-4">Select your interest</h2>
          <div
            className="text-red-700 m-1 font-medium"
            style={{ alignSelf: "self-start" }}
          >
            {message}
          </div>

          <div className="flex flex-col *:mx-2 justify-center content-center w-full mb-4 md:flex-row">
            <button
              className={`px-4 py-2 rounded-lg border mb-2 md:mb-0 ${
                selectedInterest === "Male"
                  ? "bg-pink-500 text-white"
                  : "border-gray-300"
              }`}
              onClick={() => handleGenderSelect("Male")}
            >
              Male
            </button>
            <button
              className={`px-4 py-2 rounded-lg border mb-2 md:mb-0 ${
                selectedInterest === "Female"
                  ? "bg-pink-500 text-white"
                  : "border-gray-300"
              }`}
              onClick={() => handleGenderSelect("Female")}
            >
              Female
            </button>
            <button
              className={`px-4 py-2 rounded-lg border ${
                selectedInterest === "Non Binary"
                  ? "bg-pink-500 text-white"
                  : "border-gray-300"
              }`}
              onClick={() => handleGenderSelect("Non Binary")}
            >
              Non Binary
            </button>
          </div>
          <div className="flex gap-20">
            <button
              onClick={() => setCurrentStage(currentStage - 1)}
              className="flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded mt-2"
            >
              <IoIosArrowBack />
              Back
            </button>
            <button
              onClick={nextHandler}
              className="flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded mt-2"
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

export default InterestPicker;
