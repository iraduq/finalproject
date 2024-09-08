import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import MainPage from "../src/assets/pages/home.tsx";
import LoginPage from "../src/assets/pages/login.tsx";
import TrainingPage from "../src/assets/pages/train.tsx";
import Tutorial from "../src/assets/pages/tutorial.tsx";
import AboutComponent from "../src/assets/pages/about.tsx";
import OnlineGame from "../src/assets/pages/play";
import ContactPage from "../src/assets/pages/contact.tsx";
import PuzzleGame from "./assets/pages/puzzle.tsx";
import CustomTable from "./assets/pages/profile.tsx";

const ProtectedRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const checkAuth = async () => {
    try {
      const response = await fetch("http://192.168.0.248:8000/status", {
        method: "GET",
        credentials: "include",
      });
      console.log(response);
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error checking authentication", error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return isAuthenticated ? element : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedRoute element={<MainPage />} />} />
        <Route
          path="/main"
          element={<ProtectedRoute element={<MainPage />} />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/train"
          element={<ProtectedRoute element={<TrainingPage />} />}
        />
        <Route
          path="/tutorial"
          element={<ProtectedRoute element={<Tutorial />} />}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute element={<CustomTable />} />}
        />
        <Route
          path="/about"
          element={<ProtectedRoute element={<AboutComponent />} />}
        />
        <Route
          path="/online"
          element={<ProtectedRoute element={<OnlineGame />} />}
        />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/puzzle" element={<PuzzleGame />} />
      </Routes>
    </Router>
  );
};

export default App;
