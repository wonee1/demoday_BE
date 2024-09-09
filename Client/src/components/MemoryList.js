import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MemoryList.css";
import MemoryImg from "../assets/publicmemory.svg";
import emptyIcon from "../assets/type=memory.svg";
import LikeIcon from "../assets/icon=flower.svg";
import CommentIcon from "../assets/icon=comment.svg";
import { useNavigate } from "react-router-dom";

const MemoryList = ({ groupId, isPublic, sortBy, keyword }) => {
  const [posts, setPosts] = useState([]); // Change to posts
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/groups/${groupId}/posts`, {
          params: {
            isPublic,
            sortBy,
            page,
            pageSize: 10,
            keyword,
          },
        });
        setPosts((prevPosts) => [...prevPosts, ...response.data.data]); // Change to setPosts
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      fetchPosts(); // Change to fetchPosts
    }
  }, [groupId, isPublic, sortBy, keyword, page]);

  const handleCardClick = (postId) => {
    navigate(`/posts/${postId}`); // Navigate using postId instead of memoryId
  };

  return (
    <div className="public-memory-list">
      {posts.length > 0 ? ( // Change to posts.length
        posts.map(
          (
            post // Iterate through posts
          ) => (
            <div
              key={post.id}
              className="memory-card"
              onClick={() => handleCardClick(post.id)}
            >
              <img src={post.imageUrl || MemoryImg} alt={post.title} />
              <div className="memory-info">
                <p className="nickname">
                  {post.nickname} <span className="pipe">|</span>
                  <span className="public-status">
                    {post.isPublic ? "공개" : "비공개"}
                  </span>
                </p>
                <h2>{post.title}</h2>
                <div className="tags">{post.tags.join(" ")}</div>
                <div className="like-comment-container">
                  <p className="moment">
                    {post.location} · {post.moment}
                  </p>
                  <div className="like-comment">
                    <span>
                      <img src={LikeIcon} alt="Like" />
                      {post.likeCount}
                    </span>
                    <span>
                      <img src={CommentIcon} alt="Comment" />
                      {post.commentCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        )
      ) : (
        <div className="empty-state">
          <img src={emptyIcon} alt="Empty" />
        </div>
      )}
    </div>
  );
};

export default MemoryList;
