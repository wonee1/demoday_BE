import React, { useState } from "react";

const CommentModal = ({ isOpen, onClose, onSubmit, postId }) => {
  const [nickname, setNickname] = useState("");
  const [comment, setComment] = useState("");
  const [password, setPassword] = useState("");

  // postId 디버깅 로그 추가
  console.log("Post ID in CommentModal:", postId);

  const handleSubmit = async () => {
    try {
      const requestBody = {
        nickname,
        content: comment,
        password,
      };

      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error submitting comment:", errorData);
        return;
      }

      const responseData = await response.json();
      onSubmit(responseData);
      onClose();
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>댓글 작성</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
          <textarea
            placeholder="댓글 내용을 입력하세요"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          ></textarea>
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" onClick={handleSubmit}>
            댓글 등록
          </button>
        </form>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default CommentModal;
