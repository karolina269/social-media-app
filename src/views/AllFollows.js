import axios from "axios";
import { useState, useEffect, useReducer } from "react";
import "./AllFollows.css";
import ArrowBack from "../img/arrow_back.png";
import ArrowForward from "../img/arrow_forward.png";

const AllFollows = () => {
  const [followed, setFollowed] = useState([]);

  const [displayed, setDisplayed] = useState([]);

  const reducer = (state, action) => {
    if (action.event.target.classList.contains("disabled")) {
      return { count: state.count };
    }
    switch (action.type) {
      case "back": {
        setDisplayed([followed[state.count - 1], followed[state.count], followed[state.count + 1]]);
        return { count: state.count - 1 };
      }
      case "forward": {
        setDisplayed([followed[state.count + 1], followed[state.count + 2], followed[state.count + 3]]);
        return { count: state.count + 1 };
      }
    }
  };

  const [state, dispatch] = useReducer(reducer, { count: 0 });

  const getAllFollows = () => {
    axios
      .post("https://akademia108.pl/api/social-app/follows/allfollows")
      .then((res) => {
        setFollowed(res.data);
        let tempDisplayed = [];
        for (let i = 0; i < 3; i++) {
          if (res.data[i]) {
            tempDisplayed = tempDisplayed.concat(res.data[i]);
          } else {
            break;
          }
        }
        setDisplayed(tempDisplayed);
      })
      .catch((error) => console.log(error));
  };

  const unfollow = (id) => {
    axios
      .post("https://akademia108.pl/api/social-app/follows/disfollow", { leader_id: id })
      .then(() => {
        getAllFollows();
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getAllFollows();
  }, []);

  return (
    <main className="followed">
      <img
        src={ArrowBack}
        alt="arrow back"
        className={"arrow" + (state.count === 0 ? " disabled" : "")}
        onClick={(e) => dispatch({ type: "back", event: e })}></img>
      {displayed.map((user) => {
        return (
          <div className="followedUser" key={user.id}>
            <img src={user.avatar_url} alt={user.username + " avatar"}></img>
            <h3>{user.username}</h3>
            <button className="btn" onClick={() => unfollow(user.id)}>
              Unfollow
            </button>
          </div>
        );
      })}
      <img
        src={ArrowForward}
        alt="arrow forward"
        className={"arrow" + (state.count + 3 === followed.length || followed.length < 4 ? " disabled" : "")}
        id="forward"
        onClick={(e) => dispatch({ type: "forward", event: e })}></img>
    </main>
  );
};

export default AllFollows;
