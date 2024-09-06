import React, { useState } from "react";
import "./CommentDeleteModal.css";

const CommentDeleteModal = ({ isOpen, onClose, onDelete, commentId }) => {
  const [password, setPassword] = useState("");

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: password,
        }),
      });

      if (response.ok) {
        // const data = await response.json();
        alert("댓글이 성공적으로 삭제되었습니다.");
        onDelete();
      } else if (response.status === 400) {
        alert("잘못된 요청입니다.");
      } else if (response.status === 403) {
        alert("비밀번호가 틀렸습니다.");
      } else if (response.status === 404) {
        alert("댓글이 존재하지 않습니다.");
      } else {
        alert("댓글 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content-delete">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2 className="delete-page-title">댓글 삭제</h2>
        <div className="delete-form-group">
          <label className="delete-label">삭제 권한 인증</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="댓글 비밀번호를 입력해 주세요"
            className="delete-password-input"
            required
          />
        </div>
        <button onClick={handleDelete} className="delete-submit-button">
          삭제하기
        </button>
      </div>
    </div>
  );
};

export default CommentDeleteModal;

// import React, { useState } from "react";
// import "./CommentDeleteModal.css";

// const CommentDeleteModal = ({ isOpen, onClose, onDelete }) => {
//   const [password, setPassword] = useState("");

//   const handlePasswordChange = (e) => {
//     setPassword(e.target.value);
//   };

//   const handleDelete = () => {
//     onDelete(password);
//     setPassword(""); // 입력된 비밀번호 초기화
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content-delete">
//         <button className="close-button" onClick={onClose}>
//           &times;
//         </button>
//         <h2 className="delete-page-title">댓글 삭제</h2>
//         <div className="delete-form-group">
//           <label className="delete-label">삭제 권한 인증</label>
//           <input
//             type="password"
//             value={password}
//             onChange={handlePasswordChange}
//             placeholder="댓글 비밀번호를 입력해 주세요"
//             className="delete-password-input"
//             required
//           />
//         </div>
//         <button onClick={handleDelete} className="delete-submit-button">
//           삭제하기
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CommentDeleteModal;
