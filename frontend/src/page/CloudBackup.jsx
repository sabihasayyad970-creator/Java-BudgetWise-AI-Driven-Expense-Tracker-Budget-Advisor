import axios from "axios";

function CloudBackup() {

  const downloadBackup = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/export-data");

      const dataStr = JSON.stringify(res.data, null, 2);

      const blob = new Blob([dataStr], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "BudgetWise_Backup.json";
      a.click();

      alert("✅ Backup file downloaded! Upload it to Google Drive.");

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