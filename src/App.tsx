import React from "react";
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
import CustomerReview from "../src/assets/pages/faq.tsx";
import AboutComponent from "../src/assets/pages/about.tsx";
import OnlineGame from "../src/assets/pages/play";
import ContactPage from "../src/assets/pages/contact.tsx";
import PuzzleGame from "./assets/pages/puzzle.tsx";

const App: React.FC = () => {
  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };

  const ProtectedRoute = ({
    element,
  }: {
    element: JSX.Element;
    path: string;
  }) => {
    return isAuthenticated() ? element : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<ProtectedRoute element={<MainPage />} path="/login" />}
        />
        <Route
          path="/main"
          element={<ProtectedRoute element={<MainPage />} path="/main" />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/train"
          element={<ProtectedRoute element={<TrainingPage />} path="/train" />}
        />
        <Route
          path="/tutorial"
          element={<ProtectedRoute element={<Tutorial />} path="/tutorial" />}
        />
        <Route
          path="/review"
          element={
            <ProtectedRoute element={<CustomerReview />} path="/review" />
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute element={<AboutComponent />} path="/about" />
          }
        />
        <Route
          path="/online"
          element={<ProtectedRoute element={<OnlineGame />} path="/online" />}
        />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/puzzle" element={<PuzzleGame />} />
      </Routes>
    </Router>
  );
};

export default App;
