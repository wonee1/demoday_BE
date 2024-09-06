import React, { useState } from "react";
import "./UploadModal.css";
import xIcon from "../assets/icon=x.svg";

const UploadModal = ({ isOpen, onClose, onSubmit }) => {
  const [groupPassword, setGroupPassword] = useState("");

  const handleSubmit = () => {
    onSubmit(groupPassword);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <img
          src={xIcon}
          alt="close"
          className="modal-close-button"
          onClick={onClose}
        />
        <h2>추억 올리기</h2>
        <p>올리기 권한 인증</p>
        <input
          type="password"
          placeholder="그룹 비밀번호를 입력해 주세요"
          value={groupPassword}
          onChange={(e) => setGroupPassword(e.target.value)}
        />
        <button onClick={handleSubmit} className="modal-submit-button">
          제출하기
        </button>
      </div>
    </div>
  );
};

export default UploadModal;
