import { useEffect, useState } from "react";
import { deleteFile, uploadFile } from "../utils/mediaHandlers";

const Profile = () => {
  const [file, setFile] = useState("");
  const [ImageUrl, setImageUrl] = useState("");
  useEffect(() => {
    console.log(file);
    console.log(ImageUrl);
    console.log(new Date().getTime().toString());
  }, [file, ImageUrl]);

  const fileUpload = (e) => {
    e.preventDefault();
    file && uploadFile(e, file, "enlightasp@gmail.com", setImageUrl);
  };

  return (
    <form>
      <label htmlFor="image">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button
          onClick={(e) => {
            fileUpload(e);
          }}
        >
          submit
        </button>
      </label>
      <h1>{ImageUrl}</h1>
      <button
        onClick={(e) => {
          deleteFile(e, ImageUrl);
        }}
      >
        delete
      </button>
    </form>
  );
};

export default Profile;
