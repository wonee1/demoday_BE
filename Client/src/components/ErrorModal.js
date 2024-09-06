// ErrorModal.js
import React from "react";
import "./Modal.css"; // 공통 스타일을 사용

const ErrorModal = ({ message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>그룹 만들기 실패</h2>
        <p>{message}</p>
        <button onClick={onClose} className="modal-button">
          확인
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;