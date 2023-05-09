import axios from "axios";
import { useState, useEffect, useReducer } from "react";
import "./AllFollows.css";
import ArrowBack from "../img/arrow_back.png";
import ArrowForward from "../img/arrow_forward.png";

const sliderReducer = (state, action) => {
  if (action.disabled) {
    return { state };
  } else {
    let displayedList = [];
    switch (action.type) {
      case "init": {
        for (let i = 0; i < 3; i++) {
          if (action.payload[i]) {
            displayedList = displayedList.concat(action.payload[i]);
          } else {
            break;
          }
        }
        return { list: displayedList, start: 0 };
      }
      case "back": {
        for (let i = state.start; i < state.start + 3; i++) {
          if (action.payload[i - 1]) {
            displayedList = displayedList.concat(action.payload[i - 1]);
          } else {
            break;
          }
        }
        return { list: displayedList, start: state.start - 1 };
      }
      case "forward": {
        for (let i = state.start; i < state.start + 3; i++) {
          if (action.payload[i + 1]) {
            displayedList = displayedList.concat(action.payload[i + 1]);
          } else {
            break;
          }
        }
        return { list: displayedList, start: state.start + 1 };
      }
    }
  }
};

const AllFollows = () => {
  const [followed, setFollowed] = useState([]);

  const [displayed, dispatch] = useReducer(sliderReducer, { list: [], start: 0 });

  const getAllFollows = () => {
    axios
      .post("https://akademia108.pl/api/social-app/follows/allfollows")
      .then((res) => {
        setFollowed(res.data);
        dispatch({ type: "init", payload: res.data });
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
        className={"arrow" + (displayed.start === 0 ? " disabled" : "")}
        onClick={() => dispatch({ type: "back", payload: followed, disabled: displayed.start === 0 })}></img>
      {displayed.list.map((user) => {
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
        className={"arrow" + (displayed.start + 3 === followed.length || followed.length < 4 ? " disabled" : "")}
        id="forward"
        onClick={() => dispatch({ type: "forward", payload: followed, disabled: displayed.start + 3 === followed.length || followed.length < 4 })}></img>
    </main>
  );
};

export default AllFollows;
