import React, { useState, useEffect } from "react";
import "../styles/Budget.css";
import { getBudgets, createBudget, deleteBudget } from "../services/budgetService";
import { getGoals } from "../services/savingsService";

function Budget() {

  const [budgets, setBudgets] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [category, setCategory] = useState("");
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [spentAmount, setSpentAmount] = useState("");

  const getUser = () => {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
  };

  useEffect(() => {
    const user = getUser();

    if (!user || !user.email) return;

    loadBudgets(user.email);
    loadSavings(user.id);

  }, []);

  const loadBudgets = async (email) => {
    try {
      const res = await getBudgets(email);
      setBudgets(res?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const loadSavings = async (userId) => {
    try {
      const res = await getGoals(userId);
      setSavingsGoals(res?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = getUser();

    if (!user || !user.email) {
      alert("User not logged in ❌");
      return;
    }

    if (!category || !monthlyLimit || !spentAmount) {
      alert("Please fill all fields");
      return;
    }

    if (Number(spentAmount) > Number(monthlyLimit)) {
      alert("Spent cannot exceed limit");
      return;
    }

    try {

      await createBudget(
        {
          category,
          monthlyLimit: Number(monthlyLimit),
          spentAmount: Number(spentAmount),
        },
        user.email   // ✅ IMPORTANT
      );

      alert("Budget Added Successfully ✅");

      setCategory("");
      setMonthlyLimit("");
      setSpentAmount("");

      loadBudgets(user.email);

    } catch (err) {
      console.error(err);
      alert("Failed ❌");
    }
  };

  const removeBudget = async (id) => {
    const user = getUser();
    await deleteBudget(id);
    loadBudgets(user.email);
  };

  return (
    <div className="budget-page">

      <h2>Budget</h2>

      <form className="budget-form" onSubmit={handleSubmit}>

        <input
          value={category}
          placeholder="Category"
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          value={monthlyLimit}
          placeholder="Monthly Limit"
          type="number"
          onChange={(e) => setMonthlyLimit(e.target.value)}
        />

        <input
          value={spentAmount}
          placeholder="Spent Amount"
          type="number"
          onChange={(e) => setSpentAmount(e.target.value)}
        />

        <button type="submit">Add Budget</button>

      </form>

      <div className="budget-section">
        <h3>Monthly Budget</h3>

        {budgets.length === 0 ? (
          <p>No budgets added yet</p>
        ) : (
          budgets.map((b) => {
            const remaining = b.monthlyLimit - b.spentAmount;

            return (
              <div className="budget-card" key={b.id}>
                <div className="budget-info">
                  <h4>{b.category}</h4>
                  <p className="remaining">₹ {remaining} remaining</p>
                </div>

                <button
                  className="delete-btn"
                  onClick={() => removeBudget(b.id)}
                >
                  Delete
                </button>
              </div>
            );
          })
        )}
      </div>

      <div className="budget-section">
        <h3>Savings Goals</h3>

        {savingsGoals.length === 0 ? (
          <p>No savings goals</p>
        ) : (
          savingsGoals.map((goal) => {
            const remaining = goal.targetAmount - goal.savedAmount;

            return (
              <div className="budget-card" key={goal.id}>
                <div className="budget-info">
                  <h4>{goal.goalName}</h4>
                  <p className="remaining">₹ {remaining} remaining</p>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

export default Budget;