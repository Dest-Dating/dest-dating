import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
  deleteObject,
} from "firebase/storage";
import { app } from "./firebase";

export const uploadFile = async (e, file, location, setFileUrl) => {
  e.preventDefault();
  // ||||||||||||||||||||||||||||||||||||||||||||||||||

  try {
    // adding date to filename to make it unique
    const fileName = new Date().getTime().toString() + file.name;
    // get firebase storage configuration
    const storage = getStorage(app);
    // reference to file location in storage - to organise into folders
    const storageRef = ref(storage, `${location}/${fileName}`);
    // upload function
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            console.log("default");
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        console.log(error.message);
      },
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log("File available at", downloadURL);
          setFileUrl(downloadURL);
        });
      }
    );

    // ||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteFile = (e, url) => {
  e.preventDefault();

  try {
    // get firebase storage configuration
    const storage = getStorage(app);
    // extracting location and name from url
    const sRef = url
      .split("/o/")[1]
      .split("?")[0]
      .replaceAll("%2F", "/")
      .replaceAll("%20", " ");
    // reference to file location in storage - to organise into folders
    const desertRef = ref(storage, sRef);

    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        // File deleted successfully
        console.log("File deleted successfully");
      })
      .catch((error) => {
        console.log(error.message);
      });
  } catch (error) {
    console.log(error.message);
  }
};
