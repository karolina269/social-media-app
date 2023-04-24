import Post from "../components/Post";
import AddPost from "../components/AddPost";
import Follow from "../components/Follow";
import axios from "axios";
import { useEffect, useState } from "react";
import "./Home.css";

const Home = (props) => {
  const [posts, setPosts] = useState([]);

  const getLatestPosts = () => {
    axios
      .post("https://akademia108.pl/api/social-app/post/latest")
      .then((res) => {
        setPosts(res.data);
      })
      .catch((error) => console.log(error));
  };

  const getMorePosts = () => {
    axios
      .post("https://akademia108.pl/api/social-app/post/older-then", { date: posts[posts.length - 1].created_at })
      .then((res) => {
        setPosts(posts.concat(res.data));
      })
      .catch((error) => console.log(error));
  };

  const getPrevPosts = () => {
    axios
      .post("https://akademia108.pl/api/social-app/post/newer-then", { date: posts[0].created_at })
      .then((res) => {
        setPosts(res.data.concat(posts));
      })
      .catch((error) => console.log(error));
  };

  const onScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight) {
      getMorePosts();
    }
  };

  useEffect(() => {
    getLatestPosts();
  }, [props.user]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [posts]);

  return (
    <div className="home">
      {props.user && <Follow user={props.user} getLatestPosts={getLatestPosts} posts={posts} />}
      {props.user && <AddPost getPrevPosts={getPrevPosts} />}
      <main className="postsList">
        {posts.map((post) => {
          return <Post post={post} key={post.id} user={props.user} setPosts={setPosts} getLatestPosts={getLatestPosts} />;
        })}
        <button onClick={getMorePosts} className="btn load">
          Load more
        </button>
      </main>
    </div>
  );
};

export default Home;
