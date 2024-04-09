import React, { useState } from "react";
import Modal from "react-modal";
import Cropper from "react-easy-crop";
import { FaTimes } from "react-icons/fa";

const ImageCropperModal = ({
  isOpen,
  onRequestClose,
  imageSrc,
  setImageSrc,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    console.log(croppedArea, croppedAreaPixels);
    setImageSrc(croppedArea);
    onRequestClose();
    // You can handle cropped area here
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 9999,
        },
        content: {
          width: "80%",
          height: "80%",
          margin: "auto",
          border: "none",
          borderRadius: "10px",
          padding: 0,
        },
      }}
    >
      <div className="relative">
        <FaTimes
          className="absolute top-0 right-0 m-4 cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={onRequestClose}
        />
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={2 / 3}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>
    </Modal>
  );
};

export default ImageCropperModal;
