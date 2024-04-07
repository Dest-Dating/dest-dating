import { useEffect } from "react";
import { publicRequest } from "../requestMethods";

const AuthCompletePage = () => {
  useEffect(() => {
    publicRequest("/user/getMe");
  }, []);

  return <div>Authentication Complete </div>;
};

export default AuthCompletePage;
