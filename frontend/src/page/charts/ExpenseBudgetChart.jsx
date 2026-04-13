import React, { useEffect, useState } from "react";

const ExpenseBudgetChart = () => {
  const [budget, setBudget] = useState(0);
  const [expense, setExpense] = useState(0);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;
  const userEmail = user?.email; // ✅ FIXED

  useEffect(() => {

    if (!userId || !userEmail) return;

    // ✅ FIX 1: CORRECT API (use email, not userId)
    fetch(`http://localhost:8080/api/budgets/user/${userEmail}`)
      .then(res => res.json())
      .then(data => {
        const totalBudget = data.reduce(
          (sum, b) => sum + Number(b.monthlyLimit || 0), // ✅ FIX 2: correct field
          0
        );
        setBudget(totalBudget);
      })
      .catch(err => console.log("Budget fetch error:", err));

    // ✅ EXPENSE (already correct)
    fetch(`http://localhost:8080/api/expenses/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        const totalExpense = data.reduce(
          (sum, e) => sum + Number(e.amount || 0),
          0
        );
        setExpense(totalExpense);
      })
      .catch(err => console.log("Expense fetch error:", err));

  }, [userId, userEmail]);

  const savings = budget - expense;

  return (
    <div className="chart-box">
      <h3>Budget Overview</h3>
      <p><strong>Total Budget:</strong> ₹{budget}</p>
      <p><strong>Total Expense:</strong> ₹{expense}</p>
      <p style={{ color: savings >= 0 ? "green" : "red", fontWeight: "bold" }}>
        Savings: ₹{savings}
      </p>
    </div>
  );
};

export default ExpenseBudgetChart;