import React, { useState, useEffect } from "react";
import "../styles/SavingsGoal.css";
import { getGoals, createGoal, deleteGoal } from "../services/savingsService";

function SavingsGoal() {

  // ✅ SAFE USER FETCH (no crash)
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;

  const [goals, setGoals] = useState([]);
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [savedAmount, setSavedAmount] = useState("");

  // ✅ LOAD GOALS SAFELY
  const loadGoals = async () => {
    try {
      if (!userId) return;

      const res = await getGoals(userId);
      setGoals(res?.data || []);
    } catch (error) {
      console.error("Error loading goals:", error);
    }
  };

  useEffect(() => {
    loadGoals();
  }, [userId]);

  // ✅ ADD GOAL
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!goalName || !targetAmount || !savedAmount) return;

    const goal = {
      goalName,
      targetAmount: Number(targetAmount),
      savedAmount: Number(savedAmount),
      userId
    };

    try {
      await createGoal(goal);

      setGoalName("");
      setTargetAmount("");
      setSavedAmount("");

      loadGoals();
    } catch (error) {
      console.error("Error creating goal:", error);
    }
  };

  // ✅ DELETE GOAL
  const removeGoal = async (id) => {
    try {
      await deleteGoal(id);
      loadGoals();
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  // ✅ SAFETY: if no user, don't crash
  if (!userId) {
    return <p>Please login to view savings goals</p>;
  }

  return (
    <div className="goal-container">

      {/* FORM */}
      <form className="goal-form" onSubmit={handleSubmit}>

        <input
          value={goalName}
          placeholder="Goal Name"
          onChange={(e) => setGoalName(e.target.value)}
        />

        <input
          type="number"
          value={targetAmount}
          placeholder="Target Amount"
          onChange={(e) => setTargetAmount(e.target.value)}
        />

        <input
          type="number"
          value={savedAmount}
          placeholder="Saved Amount"
          onChange={(e) => setSavedAmount(e.target.value)}
        />

        <button type="submit">Add Goal</button>

      </form>

      {/* LIST */}
      <div className="goal-list">

        {goals.length === 0 ? (
          <p style={{ marginTop: "10px" }}>No goals added</p>
        ) : (
          goals.map((g) => (
            <div key={g.id} className="goal-item">

              <span>
                {g.goalName} | ₹{g.savedAmount} / ₹{g.targetAmount}
              </span>

              <button onClick={() => removeGoal(g.id)}>
                Delete
              </button>

            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default SavingsGoal;