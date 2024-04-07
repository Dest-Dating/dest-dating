import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { oAuthLogin } from "../redux/apiCalls/apiCalls";

const AuthCompletePage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    oAuthLogin(dispatch);
  }, []);

  return <div>Authentication Complete </div>;
};

export default AuthCompletePage;
