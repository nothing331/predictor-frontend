import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import CreateAccountPage from "./pages/CreateAccountPage";
import MarketPage from "./pages/MarketPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/create-account" element={<CreateAccountPage />} />
      <Route path="/market" element={<MarketPage />} />
      {/* Catch-all: redirect unknown routes back to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
