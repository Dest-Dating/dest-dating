import React, { useEffect, useState } from "react";
import { FaEdit, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UploadPhotos from "./RegisterQuestions/UploadPhotos";
import { useSelector, useDispatch } from "react-redux";
import { FaXmark } from "react-icons/fa6";
import { fetchLeetCode } from "../redux/apiCalls/apiCalls";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("JohnDoe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [dob, setDob] = useState("1990-01-01");
  const [name, setName] = useState("John Doe");
  const [height, setHeight] = useState("180 cm");
  const [gender, setGender] = useState("Male");
  const [interestedIn, setInterestedIn] = useState("Female");
  const [leetCode, setLeetCode] = useState("");
  const [openUploadPhotos, setOpenUploadPhotos] = useState(false);
  const [bio, setBio] = useState("Hey there! I am using dest");
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    console.log("leetCode", leetCode);
  }, [leetCode]);

  const currentUser = useSelector(
    (state) => state?.user?.currentUser?.data?.user
  );
  const completeUser = useSelector((state) => state?.user?.currentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    setUsername(currentUser.name);
    setName(currentUser.name);
    setEmail(currentUser.email);
    setHeight(currentUser.height);
    setGender(currentUser.gender);
    setInterestedIn(currentUser.interestedInGender);
    setFadeIn(true); // Trigger the fade-in animation
    const timer = setTimeout(() => setFadeIn(false), 500); // Reset the animation after 500ms
    return () => clearTimeout(timer); // Cleanup function to clear the timer
  }, []);

  const navigate = useNavigate();

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save changes to backend
  };

  const handleBack = () => {
    navigate("/home");
  };

  const handleUploadPhotos = () => {
    setOpenUploadPhotos(!openUploadPhotos);
  };

  return (
    <div
      className={`w-full  h-full p-8 rounded-lg shadow-md profile-page ${
        fadeIn ? "opacity-100 transition-opacity duration-500" : ""
      }`}
    >
      <div className="w-full flex items-center mb-10 lg:flex-row lg:items-center justify-between ">
        <div className="flex flex-row items-center ">
          {/* {console.log(currentUser)} */}
          <div className="lg:mr-4 ">
            <div className="lg:w-40 md:w-36 w-24 aspect-square  rounded-full overflow-hidden  mr-2 ">
              <img
                src={currentUser.photosLink[0]?.photoLink}
                // src=""
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="">
            <h1 className="lg:text-6xl md:text-4xl text-2xl font-bold md:mb-2 lg:mb-2 text-stone-600">
              {username}
            </h1>
            <p className="text-gray-900 lg:text-xl md:text-lg text-xs mb-2">
              {email}
            </p>

            {isEditing ? (
              <button
                onClick={handleSave}
                className="bg-rose-500 hover:bg-rose-700 text-white px-4 py-2 text-xs md:text-base w-24 rounded"
              >
                Save
              </button>
            ) : (
              <button
                onClick={handleEdit}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 text-xs md:text-base  rounded w-24"
              >
                <FaEdit className="inline-block mr-1" />
                Edit
              </button>
            )}
          </div>
        </div>
        <button onClick={handleBack} className="mr-4 lg:mr-0">
          <FaXmark className="lg:text-5xl md:text-4xl text-lg" />
        </button>
      </div>
      <div className="w-full flex flex-col ">
        <button
          className="p-2 md:px-12 rounded bg-rose-500  hover:bg-rose-700 text-white w-full md:w-auto mx-auto mb-10"
          onClick={handleUploadPhotos}
        >
          Upload Photos
        </button>
        {openUploadPhotos && (
          <UploadPhotos
            openUploadPhotos={openUploadPhotos}
            setOpenUploadPhotos={setOpenUploadPhotos}
          />
        )}
      </div>

      <div className="flex flex-col lg:flex-row bg-gray-200 rounded-lg py-4 px-8 ">
        <div className="lg:w-2/3 pr-8">
          <div className="mb-4  rounded px-5 py-3">
            <label className="block text-gray-900 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-none shadow-md outline-none  rounded px-3  py-2"
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-4  rounded px-5 py-3">
            <label className="block text-gray-900 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-none shadow-md outline-none  rounded px-3  py-2"
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-4  rounded px-5 py-3">
            <label className="block text-gray-900 mb-2">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full border-none shadow-md outline-none  rounded px-3  py-2"
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-4  rounded px-5 py-3">
            <label className="block text-gray-900 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-none shadow-md outline-none  rounded px-3  py-2"
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-4  rounded px-5 py-3">
            <label className="block text-gray-900 mb-2">Height</label>
            <input
              type="text"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full border-none shadow-md outline-none  rounded px-3  py-2"
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-4  rounded px-5 py-3">
            <label className="block text-gray-900 mb-2">Gender</label>
            <input
              type="text"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full border-none shadow-md outline-none  rounded px-3  py-2"
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-4  rounded px-5 py-3">
            <label className="block text-gray-900 mb-2">Interested In</label>
            <input
              type="text"
              value={interestedIn}
              onChange={(e) => setInterestedIn(e.target.value)}
              className="w-full border-none shadow-md outline-none  rounded px-3  py-2"
              readOnly={!isEditing}
            />
          </div>
        </div>
        <div className="lg:w-1/3 mt-4 lg:mt-0">
          <div className="mb-4  rounded px-5 py-3">
            <label className="block text-gray-900 mb-2">Leetcode:</label>
            <input
              type="text"
              value={leetCode}
              onChange={(e) => setLeetCode(e.target.value)}
              className="w-full border-none shadow-md outline-none  rounded px-3  py-2"
              readOnly={!isEditing}
            />
            <button
              className="p-2 md:px-12 rounded bg-rose-500  hover:bg-rose-700 text-white w-full mt-4"
              onClick={() => fetchLeetCode(dispatch, leetCode, completeUser)}
            >
              Upload
            </button>
          </div>
          <div className="mb-4  rounded px-5 py-3">
            <label className="block text-gray-900 mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full border-none shadow-md outline-none  rounded px-3  py-2"
              rows="4"
              readOnly={!isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
