import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AddIncome.css";

function AddIncome() {

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id || 1; // ✅ FIX

  const [income, setIncome] = useState({
    source: "",
    amount: "",
    date: ""
  });

  const [incomeList, setIncomeList] = useState([]);
  const [editId, setEditId] = useState(null);

  // Fetch Income
  const fetchIncome = async () => {
    try {

      if (!userId) return; // ✅ SAFETY

      const res = await axios.get(
        `http://localhost:8080/api/income/user/${userId}`
      );

      setIncomeList(res.data);

    } catch (error) {
      console.error("Fetch income error:", error);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  // Input change
  const handleChange = (e) => {
    setIncome({
      ...income,
      [e.target.name]: e.target.value
    });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (editId) {

        await axios.put(
          `http://localhost:8080/api/income/${editId}`,
          {
            ...income,
            userId: userId // ✅ FIX
          }
        );

        setEditId(null);

      } else {

        await axios.post(
          "http://localhost:8080/api/income",
          {
            ...income,
            userId: userId // ✅ FIX
          }
        );

      }

      setIncome({
        source: "",
        amount: "",
        date: ""
      });

      fetchIncome();

    } catch (error) {
      console.error("Add/Update income error:", error);
    }
  };

  // Edit
  const handleEdit = (item) => {
    setIncome({
      source: item.source,
      amount: item.amount,
      date: item.date
    });
    setEditId(item.id);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this income?")) return;

    try {
      await axios.delete(
        `http://localhost:8080/api/income/${id}`
      );
      fetchIncome();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="income-wrapper">

      <div className="income-form-card">
        <h2>💰 Add Income</h2>

        <form onSubmit={handleSubmit}>

          <div className="income-field">
            <label>Source</label>
            <input
              type="text"
              name="source"
              value={income.source}
              onChange={handleChange}
              required
            />
          </div>

          <div className="income-field">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={income.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="income-field">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={income.date}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="income-save-btn">
            {editId ? "Update Income" : "Add Income"}
          </button>

        </form>
      </div>

      <div className="income-table-card">
        <h2>📊 Income History</h2>

        <table className="income-table">
          <thead>
            <tr>
              <th>Source</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {incomeList.length > 0 ? (
              incomeList.map((item) => (
                <tr key={item.id}>
                  <td>{item.source}</td>
                  <td className="income-amount">₹ {item.amount}</td>
                  <td>{item.date}</td>
                  <td>
                    <button onClick={() => handleEdit(item)}>Edit</button>
                    <button onClick={() => handleDelete(item.id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No income records</td>
              </tr>
            )}

          </tbody>
        </table>

      </div>
    </div>
  );
}

export default AddIncome;