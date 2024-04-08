import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import profileReducer from "./profileSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import conversationSlice from "./conversationSlice";
// Configuration for Redux persist
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};
// Combine reducers into root reducer
const rootReducer = combineReducers({
  user: userReducer,
  profile: profileReducer,
  conversations: conversationSlice,
});

// Create persisted reducer using persistReducer from redux-persist
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
// Create persistor for the Redux store
export const persistor = persistStore(store);
