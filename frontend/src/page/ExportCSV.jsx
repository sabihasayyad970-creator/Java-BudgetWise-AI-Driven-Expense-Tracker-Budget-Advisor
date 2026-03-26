import axios from "axios";

function ExportCSV() {

  const downloadCSV = async () => {
    try {
      const incomeRes = await axios.get("http://localhost:8080/api/income");
      const expenseRes = await axios.get("http://localhost:8080/api/expenses");

      let csv = "Type,Amount,Date\n";

      incomeRes.data.forEach(i => {
        csv += `Income,${i.amount},${i.date}\n`;
      });

      expenseRes.data.forEach(e => {
        csv += `Expense,${e.amount},${e.date}\n`;
      });

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "BudgetWise_Data.csv";
      a.click();

    } catch (error) {
      console.log("CSV Error", error);
    }
  };

  return (
    <button onClick={downloadCSV}>
      📥 Download CSV
    </button>
  );
}

export default ExportCSV;