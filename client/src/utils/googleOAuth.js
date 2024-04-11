import { publicRequest } from "../requestMethods";

export const googleAuthInitiator = (e) => {
  e.preventDefault();

  publicRequest
    .get("/user/auth/google/url")
    .then((res) => {
      console.log(res.data.url);
      // eslint-disable-next-line no-undef
      window.open(res.data.url, "_self");
    })
    .catch((err) => console.log(err));
  // console.log("abhishek ", res);
};
