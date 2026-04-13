import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const TrendChart = () => {
  const [data, setData] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;

  useEffect(() => {

    if (!userId) return;

    Promise.all([
      fetch(`http://localhost:8080/api/expenses/user/${userId}`),
      fetch(`http://localhost:8080/api/income/user/${userId}`)
    ])
      .then(async ([expenseRes, incomeRes]) => {
        const expenses = await expenseRes.json();
        const incomes = await incomeRes.json();

        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

        const monthlyExpense = {};
        const monthlyIncome = {};

        months.forEach(m => {
          monthlyExpense[m] = 0;
          monthlyIncome[m] = 0;
        });

        expenses.forEach(item => {
          if (item.date) {
            const month = new Date(item.date).toLocaleString("default", { month: "short" });
            if (monthlyExpense[month] !== undefined) {
              monthlyExpense[month] += Number(item.amount || 0);
            }
          }
        });

        incomes.forEach(item => {
          if (item.date) {
            const month = new Date(item.date).toLocaleString("default", { month: "short" });
            if (monthlyIncome[month] !== undefined) {
              monthlyIncome[month] += Number(item.amount || 0);
            }
          }
        });

        const chartData = months.map(m => ({
          name: m,
          income: monthlyIncome[m],
          expense: monthlyExpense[m]
        }));

        setData(chartData);
      });

  }, [userId]);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3>Income vs Expense Trend</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          
          {/* ✅ FIX: show all months including Dec */}
          <XAxis dataKey="name" interval={0} angle={-20} textAnchor="end" />
          
          <YAxis />
          <Tooltip formatter={(value) => `₹${value}`} />
          <Line type="monotone" dataKey="income" stroke="green" strokeWidth={3} />
          <Line type="monotone" dataKey="expense" stroke="blue" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;