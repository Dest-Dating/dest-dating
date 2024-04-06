import axios from "axios";
const BASE_URL = "https://dest-server.onrender.com";
axios.defaults.withcredentials = true;
export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
});
