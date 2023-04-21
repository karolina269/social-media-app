import axios from "axios";
import { useState } from "react";
import "./AddPost.css";

const AddPost = (props) => {
  const [postContent, setPostContent] = useState("");

  const addPost = (e) => {
    e.preventDefault();

    if (!postContent) {
      return;
    } else {
      axios
        .post("https://akademia108.pl/api/social-app/post/add", {
          content: postContent,
        })
        .then(() => {
          setPostContent("");
          props.getPrevPosts();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <form className="addPost" onSubmit={addPost}>
      <textarea placeholder="Add post..." onChange={(e) => setPostContent(e.target.value)} value={postContent}></textarea>
      <button className="btn add">Add</button>
    </form>
  );
};

export default AddPost;
