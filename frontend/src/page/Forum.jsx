import { useState } from "react";

function Forum() {

  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");

  const addPost = () => {
    if (!text) return;

    setPosts([
      {
        content: text,
        likes: 0,
        comments: []
      },
      ...posts
    ]);

    setText("");
  };

  const likePost = (index) => {
    const updated = [...posts];
    updated[index].likes++;
    setPosts(updated);
  };

  const addComment = (index, comment) => {
    if (!comment) return;

    const updated = [...posts];
    updated[index].comments.push(comment);
    setPosts(updated);
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

      {posts.map((post, i) => (
        <div key={i} style={{ marginTop: 15, padding: 10, border: "1px solid #ccc" }}>
          
          <p>{post.content}</p>

          <button onClick={() => likePost(i)}>
            👍 {post.likes}
          </button>

          <input
            placeholder="Add comment"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addComment(i, e.target.value);
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