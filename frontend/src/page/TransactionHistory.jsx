import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/TransactionHistory.css";

function TransactionHistory() {

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {

      const incomeRes = await axios.get("http://localhost:8080/api/income");
      const expenseRes = await axios.get("http://localhost:8080/api/expenses");

      const income = incomeRes.data.map((i) => ({
        type: "Income",
        category: i.source,
        amount: i.amount,
        date: i.date || "N/A"
      }));

      const expense = expenseRes.data.map((e) => ({
        type: "Expense",
        category: e.category,
        amount: e.amount,
        date: e.date || "N/A"
      }));

      const allTransactions = [...income, ...expense];

      allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

      setTransactions(allTransactions);
      setLoading(false);

    } catch (error) {
      console.error("Error loading transactions:", error);
      setLoading(false);
    }
  };

  return (

    <div className="transaction-container">

      <h3 className="transaction-title">Transaction History</h3>

      {loading ? (
        <p className="loading-text">Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p className="no-data">No transactions found</p>
      ) : (

        <div className="transaction-list">

          {transactions.map((t, index) => (

            <div
              key={index}
              className="transaction-item"  // ✅ FIXED HERE
            >

              <div className="transaction-left">
                <span className="transaction-type">{t.type}</span>
                <span className="transaction-category">{t.category}</span>
              </div>

              <div className="transaction-right">
                <span className="transaction-amount">₹ {t.amount}</span>
                <span className="transaction-date">{t.date}</span>
              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default TransactionHistory;