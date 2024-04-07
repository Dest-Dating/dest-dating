import React, { useState, useEffect } from "react";

const InterestPicker = ({
  currentStage,
  setCurrentStage,
  userData,
  setUserData,
}) => {
  const [selectedInterest, setSelectedInterest] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500); // Adjust the delay time as needed

    return () => clearTimeout(timer);
  }, []); // Run only once on component mount

  const handleGenderSelect = (gender) => {
    setSelectedInterest(gender);
  };

  const nextHandler = () => {
    setUserData({ ...userData, interestedIn: selectedInterest });
    setCurrentStage(currentStage + 1);
    // also, add to the object here
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
          <h2 className="text-lg font-bold mb-4">Pick Your Interest</h2>
          <div className="flex flex-col justify-around w-full mb-4 md:flex-row md:justify-around">
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
          <button
            onClick={() => setCurrentStage(currentStage - 1)}
            className="flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded mt-2"
          >
            Back
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
          <button
            onClick={nextHandler}
            className="flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded mt-2"
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

export default InterestPicker;
