import React, { useState } from "react";
import NameQuestion from "./RegisterQuestions/NameQuestion";
import GenderPicker from "./RegisterQuestions/GenderPicker";
import DateOfBirthPicker from "./RegisterQuestions/DateOfBirthPicker";
import UploadPhotos from "./RegisterQuestions/UploadPhotos";

const NecessaryQuestions = () => {
  const [signUpStage, setSignUpStage] = useState(1);
  return (
    <div>
      {signUpStage == 1 && (
        <NameQuestion
          currentStage={signUpStage}
          setCurrentStage={setSignUpStage}
        />
      )}
      {signUpStage == 2 && (
        <GenderPicker
          currentStage={signUpStage}
          setCurrentStage={setSignUpStage}
        />
      )}
      {signUpStage == 3 && (
        <DateOfBirthPicker
          currentStage={signUpStage}
          setCurrentStage={setSignUpStage}
        />
      )}
      {signUpStage == 4 && <UploadPhotos />}
    </div>
  );
};

export default NecessaryQuestions;
