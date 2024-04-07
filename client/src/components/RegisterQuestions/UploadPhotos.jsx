import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { uploadFile } from "../../utils/mediaHandlers";
import { useDispatch, useSelector } from "react-redux";
import { addSinglePhoto } from "../../redux/apiCalls/apiCalls";

const UploadPhotos = () => {
  const [photos, setPhotos] = useState(Array(6).fill(null));
  const [currentImg, setCurrentImg] = useState("");
  const [currentInd, setCurrentInd] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const currentUser = useSelector(
    (state) => state?.user?.currentUser?.data?.user
  );
  const completeUser = useSelector((state) => state?.user?.currentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500); // Adjust the delay time as needed

    return () => clearTimeout(timer);
  }, []); // Run only once on component mount

  const handlePhotoUpload = async (e, index) => {
    const selectedPhoto = e.target.files[0];
    const newPhotos = [...photos];
    if (currentUser?.email && photos[index] == null) {
      await uploadFile(
        e,
        selectedPhoto,
        `profile/${currentUser?.email}`,
        setCurrentImg
      );
      setCurrentInd(index);
      newPhotos[index] = currentImg;
      console.log(index);
      setPhotos(newPhotos);
    } else return;
  };

  useEffect(() => {
    currentImg &&
      addSinglePhoto(dispatch, currentImg, currentInd + 1, completeUser);
  }, [currentImg, dispatch]);

  useEffect(() => {
    console.log(currentUser?.photosLink);
    currentUser?.photosLink.forEach((photo) => {
      const newPhotos = [...photos];
      newPhotos[photo.index - 1] = photo.photoLink;
      setPhotos(newPhotos);
    });
  }, [currentUser?.photosLink]);

  const handleDeletePhoto = async (index) => {
    const newPhotos = [...photos];
    newPhotos[index] = null;
    setPhotos(newPhotos);
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    navigate("/home");
    console.log("Submitted!");
  };
  useEffect(() => {
    console.log(photos);
  }, [photos]);

  return (
    <div
      className={`fixed top-0 right-0 bottom-0 left-0 z-50 bg-pink-100 bg-opacity-50 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      } flex justify-center items-center transition-opacity duration-500`}
    >
      <div className="max-w-xl w-full p-4 bg-white mt-10 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">
          Don&apos;t be shy, upload some photos
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {/* Big box */}
          <div className="relative col-span-2 row-span-2 aspect-w-4 aspect-h-5 overflow-hidden rounded-lg">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handlePhotoUpload(e, 0)}
              className="hidden"
              id={`photo-upload-0`}
            />
            <label
              htmlFor={`photo-upload-0`}
              className="flex items-center justify-center w-full h-full border border-dashed cursor-pointer relative"
            >
              {!photos[0] && <span className="text-4xl">+</span>}
              {photos[0] && (
                <>
                  <img
                    src={photos[0]}
                    alt={`Uploaded Photo 1`}
                    className="object-cover w-full h-full rounded-lg"
                  />
                  <button
                    className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                    onClick={() => handleDeletePhoto(0)}
                  >
                    X
                  </button>
                </>
              )}
            </label>
          </div>
          {/* Small boxes */}
          {photos.slice(1).map((photo, index) => (
            <div
              key={index + 1}
              className="relative aspect-w-4 aspect-h-5 overflow-hidden rounded-lg"
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoUpload(e, index + 1)}
                className="hidden"
                id={`photo-upload-${index + 1}`}
              />
              <label
                htmlFor={`photo-upload-${index + 1}`}
                className="flex items-center justify-center w-full h-full border border-dashed cursor-pointer relative"
              >
                {!photo && <span className="text-4xl">+</span>}
                {photo && (
                  <>
                    <img
                      src={photo}
                      alt={`Uploaded Photo ${index + 2}`}
                      className="object-cover w-full h-full rounded-lg"
                    />
                    <button
                      className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                      onClick={() => handleDeletePhoto(index + 1)}
                    >
                      X
                    </button>
                  </>
                )}
              </label>
            </div>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default UploadPhotos;
