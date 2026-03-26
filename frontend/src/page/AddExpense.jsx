import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AddExpense.css";

function AddExpense() {

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id || 1; // ✅ FIX ADDED

  const [expense, setExpense] = useState({
    id: null,
    title: "",
    category: "",
    amount: "",
    date: ""
  });

  const [expenses, setExpenses] = useState([]);

  const [isEditing, setIsEditing] = useState(false);

  // FETCH EXPENSES
  const fetchExpenses = async () => {

    try {

      if (!userId) return; // ✅ SAFETY FIX

      const res = await axios.get(
        `http://localhost:8080/api/expenses/user/${userId}` // ✅ FIXED
      );

      setExpenses(res.data);

    } catch (err) {

      console.error("Fetch expense error:", err);

    }

  };

  useEffect(() => {

    fetchExpenses();

  }, []);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {

    setExpense({
      ...expense,
      [e.target.name]: e.target.value
    });

  };

  // ADD OR UPDATE EXPENSE
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (isEditing) {

        await axios.put(
          `http://localhost:8080/api/expenses/${expense.id}`,
          {
            ...expense,
            userId: userId // ✅ FIXED
          }
        );

        setIsEditing(false);

      } else {

        await axios.post(
          "http://localhost:8080/api/expenses",
          {
            ...expense,
            userId: userId // ✅ FIXED
          }
        );

      }

      setExpense({
        id: null,
        title: "",
        category: "",
        amount: "",
        date: ""
      });

      fetchExpenses();

    } catch (err) {

      console.error("Add/Update expense error:", err);

    }

  };

  // DELETE EXPENSE
  const deleteExpense = async (id) => {

    if (!window.confirm("Delete this expense?")) return;

    try {

      await axios.delete(
        `http://localhost:8080/api/expenses/${id}`
      );

      fetchExpenses();

    } catch (err) {

      console.error("Delete error:", err);

    }

  };

  // EDIT EXPENSE
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

      {/* FORM */}

      <div className="form-section">

        <h2>{isEditing ? "Edit Expense" : "Add Expense"}</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={expense.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={expense.category}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={expense.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={expense.date}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="save-btn">
            {isEditing ? "Update Expense" : "Save Expense"}
          </button>

        </form>

      </div>

      {/* TABLE */}

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

                    <button
                      className="edit-btn"
                      onClick={() => editExpense(item)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteExpense(item.id)}
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>
                <td colSpan="5">No expenses added yet</td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default AddExpense;