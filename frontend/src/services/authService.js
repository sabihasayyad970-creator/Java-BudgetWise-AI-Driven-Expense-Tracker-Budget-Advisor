import axios from "axios";

const API_URL = "http://localhost:8080/api/profile";

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.token : null;
};

export const getProfile = async () => {

  const token = getToken();

  if (!token) {
    throw new Error("No token found. Please login.");
  }

  const response = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};