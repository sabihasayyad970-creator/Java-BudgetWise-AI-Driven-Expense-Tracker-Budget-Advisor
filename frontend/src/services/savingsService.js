import axios from "axios";

const API_URL = "http://localhost:8080/api/savings";

// ✅ FIXED TOKEN
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// ✅ GET USER-SPECIFIC GOALS
export const getGoals = (userId) => {
  return axios.get(`${API_URL}/user/${userId}`, getAuthHeader());
};

// ✅ Create goal
export const createGoal = (goal) => {
  return axios.post(API_URL, goal, getAuthHeader());
};

// ✅ Delete goal
export const deleteGoal = (id) => {
  return axios.delete(`${API_URL}/${id}`, getAuthHeader());
};