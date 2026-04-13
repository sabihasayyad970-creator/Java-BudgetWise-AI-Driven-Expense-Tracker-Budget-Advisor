import { useState, useEffect } from "react";
import axios from "axios";

function Forum() {

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");

  // ✅ LOAD POSTS FROM BACKEND
  const loadPosts = async () => {
    try {
      if (!userId) return;

      const res = await axios.get(
        `http://localhost:8080/api/forum/user/${userId}`
      );

      setPosts(res.data);

    } catch (error) {
      console.error("Load posts error:", error);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [userId]);

  // ✅ ADD POST
  const addPost = async () => {
    if (!text) return;

    try {

      await axios.post("http://localhost:8080/api/forum", {
        content: text,
        userId: userId
      });

      setText("");
      loadPosts();

    } catch (error) {
      console.error("Post error:", error);
    }
  };

  // ✅ LIKE POST
  const likePost = async (id) => {
    try {
      await axios.put(
        `http://localhost:8080/api/forum/like/${id}`
      );
      loadPosts();
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  // ✅ ADD COMMENT
  const addComment = async (id, comment) => {
    if (!comment) return;

    try {
      await axios.put(
        `http://localhost:8080/api/forum/comment/${id}`,
        comment,
        {
          headers: { "Content-Type": "text/plain" }
        }
      );

      loadPosts();

    } catch (error) {
      console.error("Comment error:", error);
    }
  };

  return (
    <div className="module-box">
      <h2>💬 Financial Tips Forum</h2>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share financial tip..."
      />
      <button onClick={addPost}>Post</button>

      {posts.map((post) => (
        <div key={post.id} style={{ marginTop: 15, padding: 10, border: "1px solid #ccc" }}>

          <p>{post.content}</p>

          <button onClick={() => likePost(post.id)}>
            👍 {post.likes}
          </button>

          <input
            placeholder="Add comment"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addComment(post.id, e.target.value);
                e.target.value = "";
              }
            }}
          />

          {post.comments.map((c, j) => (
            <p key={j}>💬 {c}</p>
          ))}

        </div>
      ))}

    </div>
  );
}

export default Forum;