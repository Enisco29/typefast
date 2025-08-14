import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TestPage from "./pages/TestPage";
import ResultPage from "./pages/ResultPage";
import HistoryPage from "./pages/HistoryPage";
import ConfigurePage from "./pages/ConfigurePage";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import type { PropsWithChildren } from "react";

// Guard: Only allow entering Test when coming from Configure with state
const RequireConfig = ({ children }: PropsWithChildren) => {
  const location = useLocation() as { state?: { difficulty?: string; mode?: string } };
  const hasConfig = Boolean(location.state?.difficulty && location.state?.mode);
  if (!hasConfig) {
    return <Navigate to="/configure" replace />;
  }
  return <>{children}</>;
};



const AppContent = () => {
  const location = useLocation();
  const showNavber = location.pathname !== "/test";
  return (
    <>
     {showNavber && <Navbar />}
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/configure" element={<ConfigurePage />} />
        <Route path="/test" element={<RequireConfig><TestPage /></RequireConfig>} />
        <Route path="/result" element={<ResultPage /> }/>
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
};

const App = () => {
  return <AppContent/>
}

export default App;
