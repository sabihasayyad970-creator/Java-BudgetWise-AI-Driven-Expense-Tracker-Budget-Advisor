import { useEffect, useState } from "react"; 
import axios from "axios";
import "../styles/AddExpense.css";

function AddExpense() {

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const [expense, setExpense] = useState({
    id: null,
    title: "",
    category: "",
    amount: "",
    date: ""
  });

  const [expenses, setExpenses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const fetchExpenses = async () => {
    try {
      if (!userId) return;
      const res = await axios.get(`http://localhost:8080/api/expenses/user/${userId}`);
      setExpenses(res.data);
    } catch (err) {
      console.error("Fetch expense error:", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [userId]);

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!userId) return;

      if (isEditing) {
        await axios.put(
          `http://localhost:8080/api/expenses/${expense.id}`,
          { ...expense, userId }
        );
        setIsEditing(false);
      } else {
        await axios.post(
          "http://localhost:8080/api/expenses",
          { ...expense, userId }
        );
      }

      setExpense({ id: null, title: "", category: "", amount: "", date: "" });
      await fetchExpenses(); // refresh table

    } catch (err) {
      console.error("Add/Update expense error:", err);
    }
  };

  const deleteExpense = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/expenses/${id}`);
      await fetchExpenses();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const editExpense = (item) => {
    setExpense({
      id: item.id,
      title: item.title,
      category: item.category,
      amount: item.amount,
      date: item.date
    });
    setIsEditing(true);
  };

  return (
    <div className="expense-container">

      <div className="form-section">
        <h2>{isEditing ? "Edit Expense" : "Add Expense"}</h2>
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Title</label>
            <input type="text" name="title" value={expense.title} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input type="text" name="category" value={expense.category} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Amount</label>
            <input type="number" name="amount" value={expense.amount} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input type="date" name="date" value={expense.date} onChange={handleChange} required />
          </div>

          <button type="submit" className="save-btn">
            {isEditing ? "Update Expense" : "Save Expense"}
          </button>

        </form>
      </div>

      <div className="table-section">
        <h2>Expense History</h2>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length > 0 ? (
              expenses.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.category}</td>
                  <td>₹ {item.amount}</td>
                  <td>{item.date}</td>
                  <td>
                    <button onClick={() => editExpense(item)}>Edit</button>
                    <button onClick={() => deleteExpense(item.id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5">No expenses added yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default AddExpense;