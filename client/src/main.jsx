import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// redux imports
import { Provider } from "react-redux"; //redux state provider
import { store, persistor } from "./redux/store.js"; //persistor to keep data in local storage
import { PersistGate } from "redux-persist/integration/react"; //persistgate to implement persistor

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
