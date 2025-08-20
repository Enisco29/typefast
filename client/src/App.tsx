import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TestPage from "./pages/TestPage";
import ResultPage from "./pages/ResultPage";
import HistoryPage from "./pages/HistoryPage";
import ConfigurePage from "./pages/ConfigurePage";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import type { PropsWithChildren } from "react";
import Login from "./pages/auth/Login";
import { Toaster } from "react-hot-toast";
import LeaderboardPage from "./pages/LeaderboardPage";

// Guard: Only allow entering Test when coming from Configure with state
const RequireConfig = ({ children }: PropsWithChildren) => {
  const location = useLocation() as {
    state?: { difficulty?: string; mode?: string };
  };
  const hasConfig = Boolean(location.state?.difficulty && location.state?.mode);
  if (!hasConfig) {
    return <Navigate to="/configure" replace />;
  }
  return <>{children}</>;
};

const AppContent = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const showNavbar = location.pathname !== "/test";
  return (
    <>
      {showNavbar && <Navbar />}
      <Toaster />
      <Routes>
        <Route index element={<HomePage />} />
        {token && <Route path="/configure" element={<ConfigurePage />} />}
       {token && <Route
          path="/test"
          element={
            <RequireConfig>
              <TestPage />
            </RequireConfig>
          }
        />}
        {token && <Route path="/result" element={<ResultPage />} />}
        {token && <Route path="/history" element={<HistoryPage />} />}
        {token && <Route path="/leaderboard" element={<LeaderboardPage />} />}
        <Route path="/about" element={<About />} />
        <Route path="/auth" element={<Login />} />
      </Routes>
    </>
  );
};

const App = () => {
  return <AppContent />;
};

export default App;
