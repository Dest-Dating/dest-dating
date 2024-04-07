import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { oAuthLogin } from "../redux/apiCalls/apiCalls";
import { useNavigate } from "react-router-dom";

const AuthCompletePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    oAuthLogin(dispatch, navigate);
  }, []);

  return <div>Authentication Complete </div>;
};

export default AuthCompletePage;
