import React, { useState, useEffect } from "react";
import "./CommentEditModal.css";

const CommentEditModal = ({
  isOpen,
  onClose,
  onSubmit,
  commentData,
  commentId,
}) => {
  const [nickname, setNickname] = useState("");
  const [comment, setComment] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // 오류 메시지 상태 추가

  useEffect(() => {
    if (commentData) {
      setNickname(commentData.nickname || "");
      setComment(commentData.content || "");
    }
  }, [commentData]);

  const handleSubmit = async () => {
    const updatedCommentData = {
      nickname,
      content: comment,
      password,
    };

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCommentData),
      });

      if (response.ok) {
        const updatedComment = await response.json();
        onSubmit(updatedComment); // 성공 시 댓글 수정 데이터를 부모 컴포넌트로 전달
        onClose(); // 모달 닫기
      } else if (response.status === 403) {
        setErrorMessage("비밀번호가 틀렸습니다");
      } else if (response.status === 404) {
        setErrorMessage("댓글을 찾을 수 없습니다");
      } else {
        setErrorMessage("잘못된 요청입니다");
      }
    } catch (error) {
      setErrorMessage("서버와의 통신 중 오류가 발생했습니다");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="commentedit-modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>댓글 수정</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="commentedit-form-group">
            <label>닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력해 주세요"
              required
            />
          </div>
          <div className="commentedit-form-group">
            <label>댓글</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="댓글을 입력해 주세요"
              required
            />
          </div>
          <div className="commentedit-form-group">
            <label>수정 권한 인증</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="댓글 비밀번호를 입력해 주세요"
              required
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}{" "}
          {/* 오류 메시지 표시 */}
          <button type="submit" onClick={handleSubmit}>
            수정하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentEditModal;

// import React, { useState, useEffect } from "react";
// import "./CommentEditModal.css";

// const CommentEditModal = ({ isOpen, onClose, onSubmit, commentData }) => {
//   const [nickname, setNickname] = useState("");
//   const [comment, setComment] = useState("");
//   const [password, setPassword] = useState("");

//   useEffect(() => {
//     if (commentData) {
//       setNickname(commentData.nickname || "");
//       setComment(commentData.content || "");
//     }
//   }, [commentData]);

//   const handleSubmit = () => {
//     const updatedCommentData = {
//       nickname,
//       content: comment,
//       password,
//     };
//     onSubmit(updatedCommentData);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="commentedit-modal-content">
//         <button className="close-button" onClick={onClose}>
//           &times;
//         </button>
//         <h2>댓글 수정</h2>
//         <form onSubmit={(e) => e.preventDefault()}>
//           <div className="commentedit-form-group">
//             <label>닉네임</label>
//             <input
//               type="text"
//               value={nickname}
//               onChange={(e) => setNickname(e.target.value)}
//               placeholder="닉네임을 입력해 주세요"
//               required
//             />
//           </div>
//           <div className="commentedit-form-group">
//             <label>댓글</label>
//             <textarea
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//               placeholder="댓글을 입력해 주세요"
//               required
//             />
//           </div>
//           <div className="commentedit-form-group">
//             <label>수정 권한 인증</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="댓글 비밀번호를 입력해 주세요"
//               required
//             />
//           </div>
//           <button type="submit" onClick={handleSubmit}>
//             수정하기
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CommentEditModal;
