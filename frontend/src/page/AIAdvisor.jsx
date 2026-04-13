import { useEffect, useState } from "react"; 
import axios from "axios";
import "../styles/AIAdvisor.css";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

function AIAdvisor() {

  const [data, setData] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [topCategory, setTopCategory] = useState("");
  const [trend, setTrend] = useState("");
  const [prediction, setPrediction] = useState(0);

  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [savings, setSavings] = useState(0);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;

  useEffect(() => {
    if (userId) {
      loadAIData();
    }
  }, [userId]);

  const loadAIData = async () => {
    try {

      const incomeRes = await axios.get(`http://localhost:8080/api/income/user/${userId}`);
      const expenseRes = await axios.get(`http://localhost:8080/api/expenses/user/${userId}`);

      const totalIncome = incomeRes.data.reduce((sum, i) => sum + i.amount, 0);
      const totalExpense = expenseRes.data.reduce((sum, e) => sum + e.amount, 0);
      const totalSavings = totalIncome - totalExpense;

      setIncome(totalIncome);
      setExpense(totalExpense);
      setSavings(totalSavings);

      setData([
        { name: "Income", value: totalIncome },
        { name: "Expense", value: totalExpense },
        { name: "Savings", value: totalSavings }
      ]);

      const res = await axios.get(`http://127.0.0.1:5001/ai-analysis/${userId}`);
      setAnalysis(res.data.analysis);
      setTopCategory(res.data.top_category);
      setTrend(res.data.monthly_trend);

      // ✅ FIXED PREDICTION
      const pred = await axios.get(
        `http://127.0.0.1:5001/predict-expense/${userId}`
      );

      if (pred.data.status === "success") {
        setPrediction(pred.data.predicted_expense);
      }

    } catch (error) {
      console.log(error);
      setAnalysis("❌ Cannot connect to AI server");
    }
  };

  const COLORS = ["#22c55e", "#ef4444", "#3b82f6"];

  return (
    <div className="advisor-container">

      <h2>🤖 AI Financial Advisor</h2>

      <div className="advisor-card">

        <div className="advisor-summary">
          <p><strong>Total Income:</strong> ₹ {income}</p>
          <p><strong>Total Expense:</strong> ₹ {expense}</p>
          <p><strong>Savings:</strong> ₹ {savings}</p>
        </div>

        <PieChart width={400} height={300}>
          <Pie data={data} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>

        <div className="advisor-message">
          <p>{analysis}</p>
          <p>🔥 Top Spending Category: <strong>{topCategory}</strong></p>
          <p>📈 Monthly Insight: <strong>{trend}</strong></p>
          <p>📊 Predicted Next Expense: <strong>₹ {prediction}</strong></p>
        </div>

      </div>

    </div>
  );
}

export default AIAdvisor;