import Background from "../constants/background/background.tsx";
import Header from "../constants/header/header.tsx";
import Footer from "../constants/footer/footer";
import LoginForm from "../components/login/login.tsx";
import Reviews from "../components/reviews/reviews.tsx";

const LoginPage = () => {
  return (
    <div className="login-content">
      <div
        className="header-login"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Header />
      </div>
      <Background />
      <LoginForm />
      <Reviews />
      <Footer />
    </div>
  );
};

export default LoginPage;
