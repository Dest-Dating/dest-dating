import { publicRequest } from "../requestMethods";

export const googleSuccess = (res) => {};
export const googleFailure = () => {
  console.log("Failure");
};

export const googleAuthInitiator = (e) => {
  e.preventDefault();
  publicRequest
    .get("/user/auth/google/url")
    .then((res) => {
      console.log(res.data.url);
      window.open(res.data.url);
    })
    .catch((err) => console.log(err));
  // console.log("abhishek ", res);
};
