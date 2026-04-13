import axios from "axios";

function CloudBackup() {

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const downloadBackup = async () => {
    try {

      const incomeRes = await axios.get(
        `http://localhost:8080/api/income/user/${userId}`
      );

      const expenseRes = await axios.get(
        `http://localhost:8080/api/expenses/user/${userId}`
      );

      const data = {
        income: incomeRes.data,
        expenses: expenseRes.data
      };

      const dataStr = JSON.stringify(data, null, 2);

      const blob = new Blob([dataStr], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "BudgetWise_Backup.json";
      a.click();

      alert("✅ Backup file downloaded!");

    } catch (error) {
      console.error("Backup error:", error);
      alert("❌ Backup failed");
    }
  };

  return (
    <div className="module-box">
      <h3>☁️ Cloud Backup</h3>
      <p>Download your data and store in Google Drive / Dropbox</p>

      <button onClick={downloadBackup}>
        📥 Download Backup File
      </button>
    </div>
  );
}

export default CloudBackup;