import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

// redux imports
import { Provider } from "react-redux"; //redux state provider
import { store, persistor } from "./redux/store.js"; //persistor to keep data in local storage
import { PersistGate } from "redux-persist/integration/react"; //persistgate to implement persistor
import { SocketProvider } from "./context/SocketProvider.jsx";

// provider for google oAuth
// import { GoogleOAuthProvider } from "@react-oauth/google";

// eslint-disable-next-line no-undef
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <GoogleOAuthProvider clientId="188158354298-4uia6palldi5nj7j1e20m68i8t6b7kcm.apps.googleusercontent.com"> */}
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <SocketProvider>
            <App />
          </SocketProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
    {/* </GoogleOAuthProvider> */}
  </React.StrictMode>
);
