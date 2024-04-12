import React, { useEffect, useState } from "react";
import { FaEdit, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UploadPhotos from "./RegisterQuestions/UploadPhotos";
import { useSelector } from "react-redux";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("JohnDoe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [dob, setDob] = useState("1990-01-01");
  const [name, setName] = useState("John Doe");
  const [height, setHeight] = useState("180 cm");
  const [gender, setGender] = useState("Male");
  const [interestedIn, setInterestedIn] = useState("Female");
  const [location, setLocation] = useState("New Delhi, India`");
  const [openUploadPhotos, setOpenUploadPhotos] = useState(false);
  const [bio, setBio] = useState("Hey there! I am using dest");

  const currentUser = useSelector(
    (state) => state?.user?.currentUser?.data?.user
  );

  useEffect(() => {
    setUsername(currentUser.name);
    setName(currentUser.name);
    setEmail(currentUser.email);
    setHeight(currentUser.height);
    setGender(currentUser.gender);
    setInterestedIn(currentUser.interestedInGender);
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
    <div className="w-full h-full p-8 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-4 flex-col lg:flex-row lg:items-start">
        <button
          onClick={handleBack}
          className="mr-4 lg:mr-0 bg-gray-100 hover:bg-gray-200 rounded-full p-3"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <div className="lg:mr-4">
          <div>
            <div className="w-1/10 h-1/5  rounded-full overflow-hidden mb-4 lg:mb-0">
              <img
                src={currentUser.photosLink[0]?.photoLink}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-3xl font-bold mb-2">{username}</h1>
          <p className="text-gray-600 mb-2">{email}</p>
        </div>
      </div>
      <div>
        <div className="flex justify-between">
          <button
            className="p-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white"
            onClick={handleUploadPhotos}
          >
            Upload Photos
          </button>
          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          ) : (
            <button
              onClick={handleEdit}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              <FaEdit className="inline-block mr-1" />
              Edit
            </button>
          )}
        </div>

        {openUploadPhotos && (
          <UploadPhotos
            openUploadPhotos={openUploadPhotos}
            setOpenUploadPhotos={setOpenUploadPhotos}
          />
        )}
      </div>
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-2/3 pr-8">
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full  px-3 py-2 focus:outline-none"
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full  px-3 py-2 focus:outline-none"
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full  px-3 py-2 focus:outline-none"
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full  px-3 py-2 focus:outline-none"
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Height</label>
            <input
              type="text"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full  px-3 py-2 focus:outline-none"
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Gender</label>
            <input
              type="text"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full  px-3 py-2 focus:outline-none"
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Interested In</label>
            <input
              type="text"
              value={interestedIn}
              onChange={(e) => setInterestedIn(e.target.value)}
              className="w-full  px-3 py-2 focus:outline-none"
              readOnly={!isEditing}
            />
          </div>
        </div>
        <div className="lg:w-1/3 mt-4 lg:mt-0">
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full  px-3 py-2 focus:outline-none"
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full  px-3 py-2 focus:outline-none"
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
