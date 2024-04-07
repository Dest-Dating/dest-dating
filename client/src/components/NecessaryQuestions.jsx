import React, { useEffect, useState } from "react";
import NameQuestion from "./RegisterQuestions/NameQuestion";
import GenderPicker from "./RegisterQuestions/GenderPicker";
import DateOfBirthPicker from "./RegisterQuestions/DateOfBirthPicker";
import UploadPhotos from "./RegisterQuestions/UploadPhotos";
import InterestPicker from "./RegisterQuestions/InterestPicker";

const NecessaryQuestions = () => {
  const [userData, setUserData] = useState({});
  const [signUpStage, setSignUpStage] = useState(1);
  useEffect(() => {
    console.log(userData);
  }, [userData]);

  return (
    <div>
      {signUpStage == 1 && (
        <NameQuestion
          currentStage={signUpStage}
          setCurrentStage={setSignUpStage}
          userData={userData}
          setUserData={setUserData}
        />
      )}
      {signUpStage == 2 && (
        <GenderPicker
          currentStage={signUpStage}
          setCurrentStage={setSignUpStage}
          userData={userData}
          setUserData={setUserData}
        />
      )}
      {signUpStage == 3 && (
        <InterestPicker
          currentStage={signUpStage}
          setCurrentStage={setSignUpStage}
          userData={userData}
          setUserData={setUserData}
        />
      )}
      {signUpStage == 4 && (
        <DateOfBirthPicker
          currentStage={signUpStage}
          setCurrentStage={setSignUpStage}
          userData={userData}
          setUserData={setUserData}
        />
      )}
      {signUpStage == 5 && <UploadPhotos />}
    </div>
  );
};

export default NecessaryQuestions;
