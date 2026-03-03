import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import LoginPage from "./page/Login";
import DashboardPage from "./page/Dashboard";
import ScanDetailPage from "./page/Scan";
import { ToastContainer, useToast } from "./component/Toast";

function AppInner() {
  const [page, setPage] = useState("login"); // login | dashboard | scan-detail
  const [selectedScan, setSelectedScan] = useState(null);
  const { toasts, addToast } = useToast();

  const handleLogin = () => setPage("dashboard");

  const handleScanClick = (scan) => {
    setSelectedScan(scan);
    setPage("scan-detail");
  };

  const handleBack = () => {
    setPage("dashboard");
    setSelectedScan(null);
  };

  return (
    <>
      <ToastContainer toasts={toasts} />
      {page === "login" && <LoginPage onLogin={handleLogin} />}
      {page === "dashboard" && (
        <DashboardPage onScanClick={handleScanClick} addToast={addToast} />
      )}
      {page === "scan-detail" && (
        <ScanDetailPage scan={selectedScan} onBack={handleBack} addToast={addToast} />
      )}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
