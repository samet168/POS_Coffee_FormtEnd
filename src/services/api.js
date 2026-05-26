

// import axios from "axios";

// const API_URL = axios.create({
//   baseURL: "http://localhost:8000/api",
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// API_URL.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default API_URL;

import axios from "axios";

const API_URL = axios.create({
  baseURL: "https://pos-system-coffee-backend.onrender.com/api",
  headers: {
    Accept: "application/json",
  },
});

// Attach token automatically
API_URL.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API_URL;