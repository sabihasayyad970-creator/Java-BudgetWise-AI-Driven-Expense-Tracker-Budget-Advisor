import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Dashboard.css";

import AddExpense from "./AddExpense";
import AddIncome from "./AddIncome";
import Profile from "./Profile";
import Budget from "./Budget";
import TransactionHistory from "./TransactionHistory";
import AIAdvisor from "./AIAdvisor";
import FinancialReport from "./FinancialReport";
import Forum from "./Forum";

import ExpenseBarChart from "./charts/ExpenseBarChart";
import ExpenseBudgetChart from "./charts/ExpenseBudgetChart";
import TrendChart from "./charts/TrendChart";

function Dashboard() {

  const [activeModule, setActiveModule] = useState("dashboard");

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [prediction, setPrediction] = useState(0);

  const [userName, setUserName] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;
  const userEmail = user?.email;

  // ✅ FINAL FIX: AUTO REFRESH DASHBOARD
  useEffect(() => {

    if (userId && userEmail) {
      loadData();
      loadPrediction();
    }

    loadUser();

    // 🔥 AUTO REFRESH EVERY 2 SECONDS
    const interval = setInterval(() => {
      if (userId && userEmail) {
        loadData();
      }
    }, 2000);

    return () => clearInterval(interval);

  }, [userId, userEmail]);

  const loadUser = () => {
    if (user && user.name) {
      setUserName(user.name);
    } else {
      setUserName("User");
    }
  };

  const loadData = async () => {
    try {

      // ✅ INCOME
      const incomeRes = await axios.get(
        `http://localhost:8080/api/income/user/${userId}`
      );

      const income = (incomeRes.data || []).reduce(
        (sum, i) => sum + Number(i.amount || 0), 0
      );

      // ✅ EXPENSE
      const expenseRes = await axios.get(
        `http://localhost:8080/api/expenses/user/${userId}`
      );

      const expense = (expenseRes.data || []).reduce(
        (sum, e) => sum + Number(e.amount || 0), 0
      );

      // ✅ BUDGET
      const budgetRes = await axios.get(
        `http://localhost:8080/api/budgets/user/${userEmail}`
      );

      console.log("Budget Data:", budgetRes.data); // debug

      const totalBudgetValue = (budgetRes.data || []).reduce(
        (sum, b) => sum + Number(b.monthlyLimit || 0), 0
      );

      // ✅ SET VALUES
      setTotalIncome(income);
      setTotalExpense(expense);
      setTotalBudget(totalBudgetValue);

      // ✅ FINAL SAVINGS CALCULATION
      const remaining = totalBudgetValue - expense;
      setRemainingBudget(remaining);

    } catch (err) {
      console.log("Dashboard Error:", err);
    }
  };

  const loadPrediction = async () => {
    try {

      if (!userId) return;

      const res = await axios.get(
        `http://127.0.0.1:5001/predict-expense/${userId}`
      );

      if (res.data.status === "success") {
        setPrediction(res.data.predicted_expense);
      }

    } catch (err) {
      console.log("Prediction error:", err);
      setPrediction(0);
    }
  };

  const getSuggestion = () => {
    if (totalExpense > totalBudget) return "⚠️ You exceeded your budget!";
    if (remainingBudget < totalBudget * 0.2) return "⚠️ Budget almost finished";
    return "✅ Good budget management";
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="dashboard-container">

      <div className="sidebar">
        <h2>BudgetWise</h2>
        <ul>
          <li onClick={() => setActiveModule("dashboard")}>📊 Dashboard</li>
          <li onClick={() => setActiveModule("profile")}>👤 Profile</li>
          <li onClick={() => setActiveModule("income")}>💰 Income</li>
          <li onClick={() => setActiveModule("expense")}>💳 Expense</li>
          <li onClick={() => setActiveModule("budget")}>🏦 Budget</li>
          <li onClick={() => setActiveModule("transactions")}>📜 Transactions</li>
          <li onClick={() => setActiveModule("advisor")}>🤖 AI Advisor</li>
          <li onClick={() => setActiveModule("reports")}>📄 Report</li>
          <li onClick={() => setActiveModule("forum")}>💬 Forum</li>
          <li onClick={handleLogout} style={{ color: "#f87171" }}>🚪 Logout</li>
        </ul>
      </div>

      <div className="main-content">

        {activeModule === "dashboard" && (
          <>
            <div className="welcome-box">
              <h2>Welcome back, {userName || "User"} 👋</h2>
            </div>

            <div className="card-container">
              <div className="summary-card income">
                <h4>Total Income</h4>
                <h2>₹ {totalIncome}</h2>
              </div>

              <div className="summary-card expense">
                <h4>Total Expense</h4>
                <h2>₹ {totalExpense}</h2>
              </div>

              <div className="summary-card budget">
                <h4>Total Budget</h4>
                <h2>₹ {totalBudget}</h2>
              </div>

              <div className="summary-card budget">
                <h4>Savings</h4>
                <h2>₹ {remainingBudget}</h2>
              </div>
            </div>

            <div className="module-box">
              <TrendChart />
            </div>

            <div className="chart-row">
              <div className="module-box">
                <ExpenseBarChart />
              </div>
              <div className="module-box">
                <ExpenseBudgetChart />
              </div>
            </div>

            <div className="ai-section">
              <div className="ai-box">
                <h3>🤖 AI Suggestion</h3>
                <p>{getSuggestion()}</p>
              </div>

              <div className="ai-box">
                <h3>📈 Prediction</h3>
                <p>₹ {prediction}</p>
              </div>
            </div>
          </>
        )}

        {activeModule === "profile" && <Profile />}
        {activeModule === "income" && <AddIncome />}
        {activeModule === "expense" && <AddExpense />}
        {activeModule === "budget" && <Budget />}
        {activeModule === "transactions" && <TransactionHistory />}
        {activeModule === "advisor" && <AIAdvisor />}
        {activeModule === "forum" && <Forum />}

        {activeModule === "reports" && (
          <FinancialReport
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            prediction={prediction}
          />
        )}

      </div>
    </div>
  );
}

export default Dashboard;