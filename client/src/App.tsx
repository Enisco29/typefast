import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TestPage from "./pages/TestPage";
import ResultPage from "./pages/ResultPage";
import HistoryPage from "./pages/HistoryPage";
import ConfigurePage from "./pages/ConfigurePage";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import Login from "./pages/auth/Login";
import { Toaster } from "react-hot-toast";
import LeaderboardPage from "./pages/LeaderboardPage";
import Dashboard from "./pages/Dashboard";
import Layout from "./pages/Layout";

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
        <Route path="/about" element={<About />} />
        <Route path="/auth" element={<Login />} />
        {token && <Route path="test" element={<TestPage />} />}
        <Route path="/dashboard" element={token ? <Layout /> : <Login />}>
          <Route index element={<Dashboard />} />
          {token && <Route path="configure" element={<ConfigurePage />} />}
          {token && <Route path="result" element={<ResultPage />} />}
          {token && <Route path="history" element={<HistoryPage />} />}
          {token && <Route path="leaderboard" element={<LeaderboardPage />} />}
        </Route>
      </Routes>
    </>
  );
};

const App = () => {
  return <AppContent />;
};

export default App;
