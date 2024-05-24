import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";
import Swal from "sweetalert";

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
  const [usernameValid, setUsernameValid] = useState(false);
  const [passwordLengthValid, setPasswordLengthValid] = useState(false);
  const [passwordUpperCaseValid, setPasswordUpperCaseValid] = useState(false);
  const [passwordLowerCaseValid, setPasswordLowerCaseValid] = useState(false);
  const [passwordDigitValid, setPasswordDigitValid] = useState(false);
  const [passwordSpecialCharValid, setPasswordSpecialCharValid] =
    useState(false);
  const [repeatPasswordValid, setRepeatPasswordValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (loginInput.email !== "" && loginInput.password !== "") {
        const url = `http://172.16.1.39:8000/login`;
        const response = await axios.post(url, {
          email: loginInput.email,
          password: loginInput.password,
          totp_code: "",
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
        registerInput.password === registerInput.repeatPassword &&
        emailValid
      ) {
        const url = `http://172.16.1.39:8000/create_user`;
        const response = await axios.post(url, {
          username: registerInput.username,
          password: registerInput.password,
          user_id: "",
          email: registerInput.email,
          registration_date: new Date().toISOString(),
        });
        if (response) {
          Swal({
            icon: "success",
            title: "Success",
            text: "Account registered successfully!",
          });
        }
      } else {
        throw new Error("Please provide valid input");
      }
    } catch (error) {
      Swal({
        icon: "error",
        title: "Oops...",
        text: "Error registering the account!",
      });
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

  useEffect(() => {
    setUsernameValid(
      /^[a-zA-Z]*$/.test(registerInput.username) &&
        registerInput.username !== ""
    );
    setPasswordLengthValid(registerInput.password.length >= 8);
    setPasswordUpperCaseValid(/[A-Z]/.test(registerInput.password));
    setPasswordLowerCaseValid(/[a-z]/.test(registerInput.password));
    setPasswordDigitValid(/\d/.test(registerInput.password));
    setPasswordSpecialCharValid(
      /[!@#$%^&*()_+\-=[\]{};:\\|,.<>/?]/.test(registerInput.password)
    );
    setRepeatPasswordValid(
      registerInput.password === registerInput.repeatPassword
    );
    setEmailValid(/\S+@\S+\.\S+/.test(registerInput.email));
  }, [registerInput]);

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
              defaultChecked={!isLoginTab}
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
                  <div className="restrictions">
                    <div
                      className="changed-size"
                      style={{ color: usernameValid ? "green" : "red" }}
                    >
                      {usernameValid ? "\u2713" : "\u2717"} Only characters{" "}
                    </div>
                  </div>
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
                  <div className="restrictions">
                    <div
                      className="changed-size"
                      style={{ color: passwordLengthValid ? "green" : "red" }}
                    >
                      {passwordLengthValid ? "\u2713" : "\u2717"} At least 8
                      characters
                    </div>
                    <div
                      className="changed-size"
                      style={{
                        color: passwordUpperCaseValid ? "green" : "red",
                      }}
                    >
                      {passwordUpperCaseValid ? "\u2713" : "\u2717"} One
                      uppercase
                    </div>
                    <div
                      className="changed-size"
                      style={{
                        color: passwordLowerCaseValid ? "green" : "red",
                      }}
                    >
                      {passwordLowerCaseValid ? "\u2713" : "\u2717"} One
                      lowercase
                    </div>
                    <div
                      className="changed-size"
                      style={{ color: passwordDigitValid ? "green" : "red" }}
                    >
                      {passwordDigitValid ? "\u2713" : "\u2717"} One digit
                    </div>
                    <div
                      className="changed-size"
                      style={{
                        color: passwordSpecialCharValid ? "green" : "red",
                      }}
                    >
                      {passwordSpecialCharValid ? "\u2713" : "\u2717"} One
                      special character (other than ' or ")
                    </div>
                  </div>
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
                  <div
                    className="changed-size"
                    style={{ color: repeatPasswordValid ? "green" : "red" }}
                  >
                    {repeatPasswordValid ? "\u2713" : "\u2717"} Passwords match
                  </div>
                </div>
                <div className="group">
                  <label htmlFor="email-signup" className="label">
                    Email
                  </label>
                  <input
                    id="email-signup"
                    type="email"
                    className="input"
                    name="email"
                    value={registerInput.email}
                    onChange={(e) => handleInput(e, "register")}
                  />
                  <div
                    className="changed-size"
                    style={{ color: emailValid ? "green" : "red" }}
                  >
                    {emailValid ? "\u2713" : "\u2717"} Valid email format
                  </div>
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
