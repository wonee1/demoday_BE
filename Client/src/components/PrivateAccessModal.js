import React from "react";
import "./PrivateAccessModal.css"; // Import the corresponding CSS

const PrivateAccessModal = ({ show, onClose, title, message }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={onClose} className="modal-close-button">
          확인
        </button>
      </div>
    </div>
  );
};

export default PrivateAccessModal;
