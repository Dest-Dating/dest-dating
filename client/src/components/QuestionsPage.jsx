import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NecessaryQuestions from "./NecessaryQuestions";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

function QuestionsPage() {
  const navigate = useNavigate();

  const currentUser = useSelector(
    (state) => state?.user?.currentUser?.data?.user
  );

  useEffect(() => {
    // Once the component mounts or email/password changes, set imageLoaded to true to trigger the fade-in effect
    if (!currentUser) navigate("/");
    if (currentUser?.isSignupCompleted) navigate("/home");
  }, [currentUser, navigate]);

  return (
    <div>
      {/* Render component after registration */}
      {currentUser && <NecessaryQuestions />}
    </div>
  );
}

export default QuestionsPage;
