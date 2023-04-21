import axios from "axios";
import "./Follow.css";
import { useEffect, useState } from "react";

const Follow = (props) => {
  const [recommendations, setRecommendations] = useState([]);

  const getRecomendations = () => {
    axios
      .post("https://akademia108.pl/api/social-app/follows/recommendations")
      .then((res) => {
        setRecommendations(res.data);
        console.log(res.data);
      })
      .catch((error) => console.log(error));
  };

  const follow = (id) => {
    axios
      .post("https://akademia108.pl/api/social-app/follows/follow", { leader_id: id })
      .then(() => {
        props.getLatestPosts();
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getRecomendations();
  }, [props.posts]);

  return (
    <aside className="follow">
      {recommendations.map((rec) => {
        return (
          <div className="recommendetUser" key={rec.id}>
            <img src={rec.avatar_url} alt={rec.username + " avatar"}></img>
            <h3>{rec.username}</h3>
            <button className="btn" onClick={() => follow(rec.id)}>
              Follow
            </button>
          </div>
        );
      })}
    </aside>
  );
};

export default Follow;
