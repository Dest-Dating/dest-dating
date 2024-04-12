import React, { useEffect, useState } from "react";
import NameQuestion from "./RegisterQuestions/NameQuestion";
import GenderPicker from "./RegisterQuestions/GenderPicker";
import DateOfBirthPicker from "./RegisterQuestions/DateOfBirthPicker";
import UploadPhotos from "./RegisterQuestions/UploadPhotos";
import InterestPicker from "./RegisterQuestions/InterestPicker.jsx";
import InterestFieldsPicker from "./RegisterQuestions/InterestFieldsPicker.jsx";
import HeightQuestion from "./RegisterQuestions/HeightQuestion.jsx";
import { useDispatch, useSelector } from "react-redux";
import { updateLocation } from "../redux/apiCalls/apiCalls.js";
const NecessaryQuestions = () => {
  const [userData, setUserData] = useState({});
  const [signUpStage, setSignUpStage] = useState(1);
  const dispatch = useDispatch();

  const completeUser = useSelector((state) => state?.user?.currentUser);

  // update user's location

  const getLocation = async () => {
    // eslint-disable-next-line no-undef
    if (navigator.geolocation) {
      // eslint-disable-next-line no-undef
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          updateLocation(dispatch, [longitude, latitude], completeUser);
        },
        (error) => console.log(error)
      );
    } else {
      console.log("Geolocation not supported");
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <div className="">
      {signUpStage === 1 && (
        <NameQuestion
          currentStage={signUpStage}
          setCurrentStage={setSignUpStage}
          userData={userData}
          setUserData={setUserData}
        />
      )}

      {signUpStage === 2 && (
        <DateOfBirthPicker
          currentStage={signUpStage}
          setCurrentStage={setSignUpStage}
          userData={userData}
          setUserData={setUserData}
        />
      )}

      {signUpStage === 3 && (
        <HeightQuestion
          currentStage={signUpStage}
          setCurrentStage={setSignUpStage}
          userData={userData}
          setUserData={setUserData}
        />
      )}

      {signUpStage === 4 && (
        <GenderPicker
          currentStage={signUpStage}
          setCurrentStage={setSignUpStage}
          userData={userData}
          setUserData={setUserData}
        />
      )}
      {signUpStage === 5 && (
        <InterestPicker
          currentStage={signUpStage}
          setCurrentStage={setSignUpStage}
          userData={userData}
          setUserData={setUserData}
        />
      )}
      {signUpStage === 6 && (
        <InterestFieldsPicker
          currentStage={signUpStage}
          setCurrentStage={setSignUpStage}
          userData={userData}
          setUserData={setUserData}
        />
      )}
      {signUpStage === 7 && (
        <UploadPhotos
          currentStage={signUpStage}
          setCurrentStage={setSignUpStage}
          userData={userData}
          setUserData={setUserData}
        />
      )}
    </div>
  );
};

export default NecessaryQuestions;
