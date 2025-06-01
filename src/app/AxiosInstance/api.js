import axios from "axios";

const API = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
});

// Automatically attach JWT to every request if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
