import React, { useState } from "react";
import "./CommentModal.css"; // CSS remains unchanged

const CommentModal = ({ isOpen, onClose, onSubmit, postId }) => {
  const [nickname, setNickname] = useState("");
  const [comment, setComment] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State to handle error messages

  const handleSubmit = async () => {
    try {
      // Construct the request body for the API
      const requestBody = {
        nickname: nickname,
        content: comment,
        password: password,
      };

      // Send the POST request to the API
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Something went wrong!");
        return;
      }

      // Parse the successful response data
      const responseData = await response.json();
      console.log("Comment submitted successfully:", responseData);

      // Call the onSubmit function passed as a prop (if needed)
      onSubmit(responseData);

      // Close the modal after successful submission
      onClose();
    } catch (error) {
      console.error("Error submitting comment:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-comment">
      <div className="modal-content-comment">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2 className="comment-title">댓글 등록</h2>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="form-group-comment">
            <label>닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력해 주세요"
              required
            />
          </div>
          <div className="form-group-comment">
            <label>댓글</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="댓글을 입력해 주세요"
              required
            />
          </div>
          <div className="form-group-comment">
            <label>비밀번호 생성</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="댓글 비밀번호를 생성해 주세요"
              required
            />
          </div>
          <button type="submit" className="submit-button-comment">
            등록하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentModal;

// // src/components/CommentModal.js

// import React, { useState } from "react";
// import "./CommentModal.css"; // Make sure to create this CSS file

// const CommentModal = ({ isOpen, onClose, onSubmit }) => {
//   const [nickname, setNickname] = useState("");
//   const [comment, setComment] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = () => {
//     // Handle the submission logic here
//     onSubmit({ nickname, comment, password });
//     onClose(); // Close the modal after submission
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay-comment">
//       <div className="modal-content-comment">
//         <button className="close-button" onClick={onClose}>
//           &times;
//         </button>
//         <h2 className="comment-title">댓글 등록</h2>
//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             handleSubmit();
//           }}
//         >
//           <div className="form-group-comment">
//             <label>닉네임</label>
//             <input
//               type="text"
//               value={nickname}
//               onChange={(e) => setNickname(e.target.value)}
//               placeholder="닉네임을 입력해 주세요"
//               required
//             />
//           </div>
//           <div className="form-group-comment">
//             <label>댓글</label>
//             <textarea
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//               placeholder="댓글을 입력해 주세요"
//               required
//             />
//           </div>
//           <div className="form-group-comment">
//             <label>비밀번호 생성</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="댓글 비밀번호를 생성해 주세요"
//               required
//             />
//           </div>
//           <button type="submit" className="submit-button-comment">
//             등록하기
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CommentModal;
