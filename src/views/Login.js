import { useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = (props) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loginMessage, setLoginMessage] = useState("");

  const handleInputChange = (e) => {
    const target = e.target;
    const name = target.name;

    setFormData({
      ...formData,
      [name]: target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("https://akademia108.pl/api/social-app/user/login", {
        username: formData.username,
        password: formData.password,
      })
      .then((res) => {
        if (Array.isArray(res.data.username)) {
          setLoginMessage(res.data.username[0]);
        } else if (Array.isArray(res.data.password)) {
          setLoginMessage(res.data.password[0]);
        } else if (res.data.error) {
          setLoginMessage("Incorrect username or password.");
        } else {
          setLoginMessage("");
          props.setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <main className="login">
      {props.user && <Navigate to="/" />}
      <form onSubmit={handleSubmit}>
        {loginMessage && <h2 className="error">{loginMessage}</h2>}
        <div className="formField">
          <div className="labelWrapper">
            <hr></hr>
            <label htmlFor="username">username:</label>
            <hr></hr>
          </div>
          <input type="text" name="username" id="username" placeholder="Your username" value={formData.username} onChange={handleInputChange}></input>
        </div>

        <div className="formField">
          <div className="labelWrapper">
            <hr></hr>
            <label htmlFor="password">password:</label>
            <hr></hr>
          </div>
          <input type="password" name="password" id="password" placeholder="********" value={formData.password} onChange={handleInputChange}></input>
        </div>

        <div className="formField">
          <button className="btn login" title="acces key: l">
            Log in
          </button>
        </div>
      </form>
    </main>
  );
};

export default Login;
