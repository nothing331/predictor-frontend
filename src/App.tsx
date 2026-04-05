import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthMe } from "./hooks/useAuthMe";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import CreateAccountPage from "./pages/CreateAccountPage";
import MarketPage from "./pages/MarketPage";
import PortfolioPage from "./pages/PortfolioPage";
import { MARKET_ROUTE_PATTERN } from "./features/markets/marketRoutes";
import { useCurrentUserBootstrap } from "./hooks/useAccount";

export default function App() {
  // Hydrate user data (balance, role, gift status) when authenticated
  useAuthMe();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/create-account" element={<CreateAccountPage />} />
      <Route path="/portfolio" element={<PortfolioPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/market" element={<Navigate to="/" replace />} />
      <Route path={MARKET_ROUTE_PATTERN} element={<MarketPage />} />
      {/* Catch-all: redirect unknown routes back to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
