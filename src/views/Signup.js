import { Navigate, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./Signup.css";

const Signup = (props) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [signupMessage, setSignupMessage] = useState("");

  const [signupDone, setSignupDone] = useState(false);

  const validate = () => {
    let validationErrors = {
      username: false,
      email: false,
      password: false,
      confirmPassword: false,
    };

    if (formData.username.trim().length < 4) {
      validationErrors.username = true;
      setErrors((prevErrors) => {
        return { ...prevErrors, username: "Username must contain at least 4 characters" };
      });
    } else if (!/^[^\s]*$/.test(formData.username.trim())) {
      validationErrors.username = true;
      setErrors((prevErrors) => {
        return { ...prevErrors, username: "Username must not contain whitespaces" };
      });
    } else {
      validationErrors.username = false;
      setErrors((prevErrors) => {
        return { ...prevErrors, username: "" };
      });
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email.trim())) {
      validationErrors.email = true;
      setErrors((prevErrors) => {
        return { ...prevErrors, email: "Email address must be valid" };
      });
    } else {
      validationErrors.email = false;
      setErrors((prevErrors) => {
        return { ...prevErrors, email: "" };
      });
    }

    if (formData.password.trim().length < 6) {
      validationErrors.password = true;
      setErrors((prevErrors) => {
        return { ...prevErrors, password: "Password must contain at least 6 characters" };
      });
    } else if (!/^[^\s]*$/.test(formData.password.trim())) {
      validationErrors.password = true;
      setErrors((prevErrors) => {
        return { ...prevErrors, password: "Password must not contain whitespaces" };
      });
    } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(formData.password.trim())) {
      validationErrors.password = true;
      setErrors((prevErrors) => {
        return { ...prevErrors, password: "Password must contain at least one special character" };
      });
    } else {
      validationErrors.password = false;
      setErrors((prevErrors) => {
        return { ...prevErrors, password: "" };
      });
    }

    if (formData.password.trim() !== formData.confirmPassword.trim()) {
      validationErrors.password = true;
      setErrors((prevErrors) => {
        return { ...prevErrors, confirmPassword: "Passwords must be the same" };
      });
    } else {
      validationErrors.password = false;
      setErrors((prevErrors) => {
        return { ...prevErrors, confirmPassword: "" };
      });
    }

    return !validationErrors.username && !validationErrors.email && !validationErrors.password && !validationErrors.confirmPassword;
  };

  const handleInputChange = (e) => {
    const target = e.target;
    const name = target.name;

    setFormData({
      ...formData,
      [name]: target.value,
    });

    axios
      .post("https://akademia108.pl/api/social-app/user/signup", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.signedup) {
          setSignupMessage("Account created");
          setSignupDone(true);
        } else if (res.data.message.username) {
          setSignupMessage(res.data.message.username[0]);
        } else if (res.data.message.email) {
          setSignupMessage(res.data.message.email[0]);
        }
      })
      .catch((error) => console.log(error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }
    console.log("wysylam");
  };

  return (
    <main className="signup">
      {props.user && <Navigate to="/" />}
      <form onSubmit={handleSubmit} noValidate>
        {signupMessage && <h2>{signupMessage}</h2>}
        <div className="formField">
          <div className="labelWrapper">
            <hr></hr>
            <label htmlFor="username">username:</label>
            <hr></hr>
          </div>
          <input type="text" name="username" placeholder="User name" onChange={handleInputChange} />
          {errors.username && <p className="error">{errors.username}</p>}
        </div>
        <div className="formField">
          <div className="labelWrapper">
            <hr></hr>
            <label htmlFor="email">email:</label>
            <hr></hr>
          </div>
          <input type="email" name="email" placeholder="Email" onChange={handleInputChange} />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div className="formField">
          <div className="labelWrapper">
            <hr></hr>
            <label htmlFor="password">password:</label>
            <hr></hr>
          </div>
          <input type="password" name="password" placeholder="********" onChange={handleInputChange} />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <div className="formField">
          <div className="labelWrapper">
            <hr></hr>
            <label htmlFor="confirmPassword">confirm password:</label>
            <hr></hr>
          </div>
          <input type="password" id="confirmPassword " name="confirmPassword" placeholder="********" onChange={handleInputChange} />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        </div>
        <div className="formField">
          <button className="btn" disabled={signupDone}>
            Signup
          </button>
        </div>
        {signupDone && (
          <div>
            <Link to="login" className="btn">
              Go to login
            </Link>
          </div>
        )}
      </form>
    </main>
  );
};

export default Signup;
