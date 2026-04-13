import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

const COLORS = ["#4CAF50","#2196F3","#FF9800","#E91E63","#9C27B0","#00BCD4","#FFC107","#795548","#3F51B5"];

const ExpenseBarChart = () => {
  const [data, setData] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;

  useEffect(() => {

    if (!userId) return;

    fetch(`http://localhost:8080/api/expenses/user/${userId}`)
      .then(res => res.json())
      .then(result => {

        const grouped = {};

        result.forEach(item => {
          const category = item.category || "Other";

          if (!grouped[category]) {
            grouped[category] = 0;
          }

          grouped[category] += Number(item.amount || 0);
        });

        const chartData = Object.keys(grouped).map(key => ({
          name: key,
          amount: grouped[key]
        }));

        setData(chartData);
      });

  }, [userId]);

  return (
    <div style={{ width: "100%", height: 320 }}>
      <h3>Category-wise Expenses</h3>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => `₹${value}`} />
          <Bar dataKey="amount">
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseBarChart;