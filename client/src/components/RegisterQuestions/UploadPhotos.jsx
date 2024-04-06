import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UploadPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500); // Adjust the delay time as needed

    return () => clearTimeout(timer);
  }, []); // Run only once on component mount

  const handlePhotoUpload = (e) => {
    const selectedPhotos = Array.from(e.target.files);

    if (selectedPhotos.length + photos.length > 6) {
      // Maximum 6 photos can be uploaded
      alert("You can upload maximum 6 photos.");
      return;
    }

    setPhotos([...photos, ...selectedPhotos]);
  };

  const nextHandler = () => {
    navigate("/home");
  };

  return (
    <div
      className={`fixed top-0 right-0 bottom-0 z-50 bg-black bg-opacity-50 ${
        isOpen ? "w-full" : "w-0"
      } overflow-hidden transition-all duration-500`}
    >
      <div className="flex justify-center items-center min-h-screen bg-pink-50">
        <div
          className={`max-w-xl w-full p-4 bg-white mt-10 rounded-lg shadow-md ${
            isOpen ? "animate-slideInRight" : ""
          }`}
        >
          <h2 className="text-lg font-bold mb-4">
            Don't be shy, upload some photos
          </h2>
          <label
            htmlFor="photo-upload"
            className="flex items-center justify-center w-full h-40 border border-dashed rounded-lg cursor-pointer"
          >
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePhotoUpload}
            />
            <span className="text-4xl">+</span>
            <span className="ml-2">Add Photos</span>
          </label>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative w-full h-32">
                <img
                  src={URL.createObjectURL(photo)}
                  alt={`Uploaded Photo ${index + 1}`}
                  className="object-cover w-full h-full rounded-lg"
                />
                <button
                  className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                  onClick={() =>
                    setPhotos(photos.filter((_, i) => i !== index))
                  }
                >
                  X
                </button>
              </div>
            ))}
          </div>

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

export default UploadPhotos;
