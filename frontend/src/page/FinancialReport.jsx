import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ FIXED IMPORT
import axios from "axios";

const FinancialReport = ({ totalIncome, totalExpense, prediction }) => {

  const formatCurrency = (value) => {
    return "Rs. " + Number(value || 0).toLocaleString("en-IN");
  };

  // ✅ PDF DOWNLOAD (FIXED)
  const downloadPDF = () => {
    const doc = new jsPDF();

    const savings = totalIncome - totalExpense;
    const today = new Date().toLocaleDateString();

    doc.setFontSize(18);
    doc.text("BudgetWise Financial Report", 105, 20, { align: "center" });

    doc.setFontSize(11);
    doc.text(`Date: ${today}`, 14, 30);

    autoTable(doc, {   // ✅ FIXED
      startY: 40,
      head: [["Description", "Amount"]],
      body: [
        ["Total Income", formatCurrency(totalIncome)],
        ["Total Expense", formatCurrency(totalExpense)],
        ["Savings", formatCurrency(savings)]
      ],
      theme: "grid",
      styles: { fontSize: 12 },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: 90 }
      }
    });

    let y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 60; // ✅ SAFE FIX

    doc.text("AI Analysis:", 14, y);

    doc.text(
      totalExpense > totalIncome
        ? "Warning: Overspending"
        : "Good financial condition",
      14,
      y + 8
    );

    doc.text(
      `Next Month Expected Expense: ${formatCurrency(prediction)}`,
      14,
      y + 20
    );

    doc.save("BudgetWise_Report.pdf");
  };

  // ✅ CSV DOWNLOAD (UNCHANGED)
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

    } catch {
      alert("CSV Failed ❌");
    }
  };

  // ✅ BACKUP (UNCHANGED)
  const backupData = async () => {
    try {
      await axios.post("http://localhost:8080/api/cloud/backup", {
        income: totalIncome,
        expense: totalExpense,
        savings: totalIncome - totalExpense,
        prediction: prediction
      });

      alert("Backup Successful ✅");
    } catch {
      alert("Backup Failed ❌");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>📄 Financial Report</h2>

      {/* SUMMARY */}
      <div style={{ marginBottom: "20px" }}>
        <p><b>Total Income:</b> {formatCurrency(totalIncome)}</p>
        <p><b>Total Expense:</b> {formatCurrency(totalExpense)}</p>
        <p><b>Savings:</b> {formatCurrency(totalIncome - totalExpense)}</p>
      </div>

      {/* BUTTONS */}
      <div style={{ display: "flex", gap: "15px" }}>
        <button onClick={downloadPDF}>📥 Download PDF</button>
        <button onClick={downloadCSV}>📊 Download CSV</button>
        <button onClick={backupData}>☁️ Backup Data</button>
      </div>
    </div>
  );
};

export default FinancialReport;