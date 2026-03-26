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
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [prediction, setPrediction] = useState(0);

  const [userName, setUserName] = useState("");

  useEffect(() => {
    loadData();
    loadPrediction();
    loadUser();
  }, []);

  // USER
  const loadUser = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.name) {
        setUserName(user.name);
      } else {
        const res = await axios.get("http://localhost:8080/api/profile");
        setUserName(res.data.name);
      }
    } catch {
      setUserName("User");
    }
  };

  // DATA
  const loadData = async () => {
    try {
      const incomeRes = await axios.get("http://localhost:8080/api/income");
      const expenseRes = await axios.get("http://localhost:8080/api/expenses");

      const income = incomeRes.data.reduce((sum, i) => sum + Number(i.amount || 0), 0);
      const expense = expenseRes.data.reduce((sum, e) => sum + Number(e.amount || 0), 0);

      setTotalIncome(income);
      setTotalExpense(expense);
      setRemainingBudget(income - expense);

    } catch (err) {
      console.log(err);
    }
  };

  // ML
  const loadPrediction = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5001/predict-expense");
      if (res.data.status === "success") {
        setPrediction(res.data.predicted_expense);
      }
    } catch {
      setPrediction(0);
    }
  };

  const getSuggestion = () => {
    if (totalExpense > totalIncome) return "⚠️ You are overspending!";
    if (remainingBudget < totalIncome * 0.2) return "⚠️ Savings are low";
    return "✅ Good financial condition";
  };

  // ✅ LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="dashboard-container">

      {/* SIDEBAR */}
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

          {/* ✅ LOGOUT */}
          <li onClick={handleLogout} style={{ color: "#f87171" }}>
            🚪 Logout
          </li>
        </ul>
      </div>

      {/* MAIN */}
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
                <h4>Remaining</h4>
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

        {/* ✅ REPORT */}
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