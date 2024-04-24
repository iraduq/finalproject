import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";

const LoginForm = () => {
  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });

  const [registerInput, setRegisterInput] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
    checked: false,
  });

  const [isLoginTab, setIsLoginTab] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("token");
    if (isLoggedIn) {
      navigate("/main");
    }
  }, [navigate]);

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (loginInput.email !== "" && loginInput.password !== "") {
        console.log(loginInput.email);
        console.log(loginInput.password);
        const url = `http://192.168.38.121:8000/login`;
        const response = await axios.post(url, {
          email: loginInput.email,
          password: loginInput.password,
        });
        localStorage.setItem("token", response.data.access_token);
        navigate("/main");
      } else {
        throw new Error("Please provide valid input");
      }
    } catch (error) {
      alert("The account details are incorrect!");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (
        registerInput.username !== "" &&
        registerInput.email !== "" &&
        registerInput.password !== "" &&
        registerInput.repeatPassword !== "" &&
        registerInput.password === registerInput.repeatPassword
      ) {
        const url = `http://192.168.38.121:8000/create_user`;
        const response = await axios.post(url, {
          username: registerInput.username,
          password: registerInput.password,
          user_id: "",
          email: registerInput.email,
          registration_date: new Date().toISOString(),
        });
        localStorage.setItem("token", response.data.access_token);
        navigate("/main");
      } else {
        throw new Error("Please provide valid input");
      }
    } catch (error) {
      alert("Error registering the account!");
    }
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const { name, value } = e.target;
    if (type === "login") {
      setLoginInput((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setRegisterInput((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setRegisterInput((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleTabToggle = () => {
    setIsLoginTab((prev) => !prev);
  };

  return (
    <div className="left">
      <div className="middle">
        <div className="login-wrap">
          <div className="login-html">
            <input
              id="tab-1"
              type="radio"
              name="tab"
              className="sign-in"
              defaultChecked={isLoginTab}
            />
            <label
              htmlFor="tab-1"
              className={`tab ${isLoginTab ? "active" : ""}`}
              onClick={handleTabToggle}
            >
              Sign In
            </label>
            <input
              id="tab-2"
              type="radio"
              name="tab"
              className="sign-up"
              checked={!isLoginTab}
            />
            <label
              htmlFor="tab-2"
              className={`tab ${!isLoginTab ? "active" : ""}`}
              onClick={handleTabToggle}
            >
              Sign Up
            </label>
            <form
              onSubmit={isLoginTab ? handleLoginSubmit : handleRegisterSubmit}
              className="login-form"
            >
              <div className={`sign-in-htm ${isLoginTab ? "active" : ""}`}>
                <div className="group">
                  <label htmlFor="user-signin" className="label">
                    Email
                  </label>
                  <input
                    id="user-signin"
                    type="text"
                    className="input"
                    name="email"
                    value={loginInput.email}
                    onChange={(e) => handleInput(e, "login")}
                  />
                </div>
                <div className="group">
                  <label htmlFor="pass-signin" className="label">
                    Password
                  </label>
                  <input
                    id="pass-signin"
                    type="password"
                    className="input"
                    data-type="password"
                    name="password"
                    value={loginInput.password}
                    onChange={(e) => handleInput(e, "login")}
                  />
                </div>
                <div className="group">
                  <input
                    id="check-signin"
                    type="checkbox"
                    className="check"
                    defaultChecked={registerInput.checked}
                    onChange={handleCheckboxChange}
                  />
                </div>
                <div className="group">
                  <button type="submit" className="button">
                    Sign In
                  </button>
                </div>
                <div className="hr"></div>
                <div className="foot-lnk"></div>
              </div>
              <div className={`sign-up-htm ${!isLoginTab ? "active" : ""}`}>
                <div className="group">
                  <label htmlFor="user-signup" className="label">
                    Username
                  </label>
                  <input
                    id="user-signup"
                    type="text"
                    className="input"
                    name="username"
                    value={registerInput.username}
                    onChange={(e) => handleInput(e, "register")}
                  />
                </div>
                <div className="group">
                  <label htmlFor="pass-signup" className="label">
                    Password
                  </label>
                  <input
                    id="pass-signup"
                    type="password"
                    className="input"
                    data-type="password"
                    name="password"
                    value={registerInput.password}
                    onChange={(e) => handleInput(e, "register")}
                  />
                </div>
                <div className="group">
                  <label htmlFor="pass-repeat" className="label">
                    Repeat Password
                  </label>
                  <input
                    id="pass-repeat"
                    type="password"
                    className="input"
                    data-type="password"
                    name="repeatPassword"
                    value={registerInput.repeatPassword}
                    onChange={(e) => handleInput(e, "register")}
                  />
                </div>
                <div className="group">
                  <label htmlFor="email" className="label">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="text"
                    className="input"
                    name="email"
                    value={registerInput.email}
                    onChange={(e) => handleInput(e, "register")}
                  />
                </div>
                <div className="group">
                  <button type="submit" className="button">
                    Sign Up
                  </button>
                </div>
                <div className="hr"></div>
                <div className="foot-lnk"></div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
