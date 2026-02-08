import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // The address of your Laravel API
});

// REQUEST INTERCEPTOR (Outgoing)
// Before you send a request, check if we have a token in local storage
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS_TOKEN");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// RESPONSE INTERCEPTOR (Incoming)
// If the server says "401 Unauthorized", force the user to logout
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    try {
      const { response } = error;
      if (response.status === 401) {
        localStorage.removeItem("ACCESS_TOKEN");
      }
    } catch (e) {
      console.error(e);
    }
    throw error;
  }
);

export default axiosClient;