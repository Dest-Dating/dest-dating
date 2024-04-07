import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NecessaryQuestions from "./NecessaryQuestions";
import "react-toastify/dist/ReactToastify.css";

function QuestionsPage() {
  const [verified, setVerified] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Once the component mounts or email/password changes, set imageLoaded to true to trigger the fade-in effect
    if (!verified) navigate("/QuestionsPage");
  }, [navigate, verified]);

  return (
    <div>
      {/* Render component after registration */}
      {verified && <NecessaryQuestions />}
    </div>
  );
}

export default QuestionsPage;
