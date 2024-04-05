import "./App.css";
import { userRequest } from "./requestMethods";
import { useSelector } from "react-redux";
function App() {
  // user data of currently logged in user from redux state
  const currentUser = useSelector((state) => state?.user?.currentUser);

  // Setting authorization header for user request
  userRequest.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${currentUser?.token}`;

  return (
    <>
      <h1>hola</h1>
    </>
  );
}

export default App;
