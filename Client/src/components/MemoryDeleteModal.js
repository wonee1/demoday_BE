import React, { useState } from "react";
import axios from "axios"; // axios 임포트 추가
import "./MemoryDeleteModal.css";

const MemoryDeleteModal = ({ isOpen, onClose, onDelete = () => {}, postId }) => {
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      // 게시글 삭제 API 호출
      const response = await axios.delete(`/api/posts/${postId}`, {
        data: { postPassword: password }, // 비밀번호를 요청 본문에 포함
      });

      if (response.status === 200) {
        // 삭제 성공 처리
        console.log("게시글 삭제 성공");
        onDelete(); // 삭제 후 추가 동작 수행 (예: 페이지 리다이렉트 등)
        onClose(); // 모달 창 닫기
      }
    } catch (error) {
      // 삭제 실패 처리
      console.error(
        "게시글 삭제 실패:",
        error.response?.data?.message || error.message
      );

      if (error.response?.status === 403) {
        alert("비밀번호가 틀렸습니다.");
      } else if (error.response?.status === 400) {
        alert("잘못된 요청입니다.");
      } else if (error.response?.status === 404) {
        alert("게시글이 존재하지 않습니다.");
      } else {
        alert("삭제에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="memorydelete-modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>추억 삭제</h2>
        <div className="memorydelete-form-group">
          <label>삭제 권한 인증</label>
          <input
            type="password"
            placeholder="추억 비밀번호를 입력해 주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="memorydelete-button" onClick={handleDelete}>
          삭제하기
        </button>
      </div>
    </div>
  );
};

export default MemoryDeleteModal;
