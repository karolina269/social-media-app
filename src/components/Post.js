import { useState } from "react";
import axios from "axios";
import "./Post.css";

const Post = (props) => {
  const [likesCounter, setLikesCounter] = useState(props.post.likes.length);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [didUserLike, setDidUserLike] = useState(props.post.likes.filter((like) => like.username === props.user?.username).length !== 0);

  const unfollow = (id) => {
    axios
      .post("https://akademia108.pl/api/social-app/follows/disfollow", { leader_id: id })
      .then(() => {
        props.getLatestPosts();
      })
      .catch((error) => console.log(error));
  };

  const deletePost = (id) => {
    axios
      .post("https://akademia108.pl/api/social-app/post/delete", { post_id: id })
      .then((res) => {
        props.setPosts((posts) => {
          return posts.filter((post) => post.id !== res.data.post_id);
        });
      })
      .catch((error) => console.log(error));
  };

  const likePost = (id, isLiked) => {
    axios.post("https://akademia108.pl/api/social-app/post/" + (isLiked ? "dislike" : "like"), { post_id: id }).then(() => {
      setLikesCounter(likesCounter + (isLiked ? -1 : 1));
      setDidUserLike(!isLiked);
    });
  };

  return (
    <article className="post">
      <header className="postHeading">
        <img className="avatar" src={props.post.user.avatar_url} alt={props.post.user.username + " avatar"}></img>
        <div className="postDetails">
          <h2 className="postAuthor">{props.post.user.username}</h2>
          <p className="postTime">
            {props.post.created_at.substring(0, 10)} {props.post.created_at.substring(11, 19)}
          </p>
        </div>
      </header>
      <section className="postContent">
        <div>{props.post.content}</div>
      </section>
      <section className="postOptions">
        {props.user && props.user.username !== props.post.user.username && (
          <button className="btn" onClick={() => unfollow(props.post.user.id)}>
            Unfollow
          </button>
        )}

        {props.user?.username === props.post.user.username && (
          <button className="btn" onClick={() => setDeleteModalVisible(true)}>
            Delete
          </button>
        )}

        {props.user && (
          <button className="btn" onClick={() => likePost(props.post.id, didUserLike)}>
            {didUserLike ? "Dislike" : "Like"}
          </button>
        )}

        <div className="likesCounter">{likesCounter}</div>
      </section>

      {deleteModalVisible && (
        <div className="deleteConfirm">
          <p>Are you sure you want to delete this post?</p>
          <button className="btn yes" onClick={() => deletePost(props.post.id)}>
            Yes
          </button>
          <button className="btn cancel" onClick={() => setDeleteModalVisible(false)}>
            Cancel
          </button>
        </div>
      )}
    </article>
  );
};

export default Post;
