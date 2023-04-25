import { Link } from "react-router-dom";
import axios from "axios";
import "./AppNav.css";

const AppNav = (props) => {
  const handleLogout = (e) => {
    e.preventDefault();
    axios
      .post("https://akademia108.pl/api/social-app/user/logout")
      .then((res) => {
        console.log(res.data.message);
        if (res.data.message) {
          props.setUser(null);
          localStorage.setItem("user", null);
        }
      })
      .catch((error) => {
        console.log(error);
        props.setUser(null);
        localStorage.setItem("user", null);
      });
  };

  return (
    <nav className="mainNav">
      <ul>
        <li>
          <h1>
            <Link aria-label="Social Media App" className="btn" to="/">
              Home
            </Link>
          </h1>
        </li>
        {!props.user && (
          <li>
            <Link className="btn" to="/login">
              Login
            </Link>
          </li>
        )}
        {!props.user && (
          <li>
            <Link className="btn" to="/signup">
              Signup
            </Link>
          </li>
        )}
        {props.user && (
          <li>
            <Link className="btn" to="/allfollows">
              All Follows
            </Link>
          </li>
        )}
        {props.user && (
          <li>
            <Link className="btn" to="/" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default AppNav;
