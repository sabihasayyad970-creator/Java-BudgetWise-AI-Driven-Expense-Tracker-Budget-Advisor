import axios from "axios";

const API = "http://localhost:8080/api/budgets";

// ✅ GET USER BUDGETS
export const getBudgets = (email) => {
  return axios.get(`${API}/user/${email}`);
};

// ✅ CREATE BUDGET (🔥 FIXED: send email as PARAM)
export const createBudget = (data, email) => {
  return axios.post(`${API}?email=${email}`, data);
};

// ✅ DELETE
export const deleteBudget = (id) => {
  return axios.delete(`${API}/${id}`);
};