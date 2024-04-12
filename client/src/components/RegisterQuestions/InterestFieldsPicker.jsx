import React, { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

const InterestFieldsPicker = ({
  currentStage,
  setCurrentStage,
  userData,
  setUserData,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [interests, setInterests] = useState([]);

  let badges = [
    "Web development",
    "DSA",
    "CP",
    "Android development",
    "Machine learning",
    "Cyber-security",
    "Artificial Intelligence",
    "Game development",
    "Cloud computing",
    "IoT",
    "User experience design",
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500); // Adjust the delay time as needed

    return () => clearTimeout(timer);
  }, []); // Run only once on component mount

  const handlePick = (e) => {
    setInterests([...interests, e.target.innerText]);
  };
  const handleDelete = (e) => {
    const updatedInterests = interests.filter(
      (title) => title !== e.target.innerText
    );
    setInterests(updatedInterests);
  };

  const nextHandler = (e) => {
    e.preventDefault();
    setUserData({ ...userData, fieldsOfInterests: interests });
    if (interests.length === 0) {
      setMessage("Please select some interests!");
      return;
    }
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
          <h2 className="text-2xl font-medium underline mb-2">
            Fields of interest
          </h2>

          <div
            className="text-red-700 m-1 font-medium"
            style={{ alignSelf: "self-start" }}
          >
            {message}
          </div>

          <div className="m-5 flex flex-wrap">
            {badges.map((title, index) => {
              const isPicked = interests.includes(title);
              return (
                <div
                  key={index}
                  onClick={isPicked ? handleDelete : handlePick}
                  className={`badge border  shadow-sm border-stone-400 p-4 m-2 gap-2 cursor-pointer ${
                    isPicked && "text-white bg-blue-500 border-0 shadow-xl"
                  }`}
                >
                  {isPicked && <RxCross2 />}
                  {title}
                </div>
              );
            })}
          </div>

          <div className="flex gap-20">
            <button
              onClick={() => setCurrentStage(currentStage - 1)}
              className="flex items-center justify-center bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded mt-2"
            >
              <IoIosArrowBack />
              Back
            </button>
            <button
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

export default InterestFieldsPicker;
