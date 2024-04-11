import React, { useEffect, useState } from "react";
import NameQuestion from "./RegisterQuestions/NameQuestion";
import GenderPicker from "./RegisterQuestions/GenderPicker";
import DateOfBirthPicker from "./RegisterQuestions/DateOfBirthPicker";
import UploadPhotos from "./RegisterQuestions/UploadPhotos";
import InterestPicker from "./RegisterQuestions/InterestPicker.jsx";
import InterestFieldsPicker from "./RegisterQuestions/InterestFieldsPicker.jsx";
import HeightQuestion from "./RegisterQuestions/HeightQuestion.jsx";

const NecessaryQuestions = () => {
  const [userData, setUserData] = useState({});
  const [signUpStage, setSignUpStage] = useState(1);
  useEffect(() => {
    console.log(userData);
  }, [userData]);

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
