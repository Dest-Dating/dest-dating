import React, { useState } from "react";

const Center = () => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [photos, setPhotos] = useState([
    "https://dummyimage.com/400x300/000/fff&text=Hariom_image_1",
    "https://dummyimage.com/400x300/",
    "https://dummyimage.com/400x300/fff&text=Hariom_image_2",
    "https://dummyimage.com/400x300/",
    "https://dummyimage.com/400x300/000/fff&text=Photo+5",
  ]);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };

  const handleTick = () => {
    // Logic for handling tick button click (move to next profile)
    nextProfile();
  };

  const handleCross = () => {
    // Logic for handling cross button click (move to next profile)
    nextProfile();
  };

  const nextProfile = () => {
    // Logic for transitioning to the next profile
  };

  return (
    <div className="relative w-full h-full p-10 flex justify-center items-center">
      {/* Profile Photo */}
      <img
        src={photos[currentPhotoIndex]}
        alt={`Profile Photo ${currentPhotoIndex + 1}`}
        className="w-full h-full object-cover rounded-lg"
      />

      {/* Navigation Arrows */}
      <button
        onClick={prevPhoto}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 focus:outline-none"
      >
        {"<"}
      </button>
      <button
        onClick={nextPhoto}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 focus:outline-none"
      >
        {">"}
      </button>

      {/* Action Buttons */}
      <div className="absolute bottom-8 flex justify-center w-full py-10">
        <button
          onClick={handleCross}
          className="mx-2 w-12 h-12 text-white bg-red-500 rounded-full flex items-center justify-center focus:outline-none"
        >
          <span className="text-xl">✕</span>
        </button>
        <button
          onClick={handleTick}
          className="mx-2 w-12 h-12 text-white bg-pink-500 rounded-full flex items-center justify-center focus:outline-none"
        >
          <span className="text-xl">✔</span>
        </button>
      </div>
    </div>
  );
};

export default Center;
