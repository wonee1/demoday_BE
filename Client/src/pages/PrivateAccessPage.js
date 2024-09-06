import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./PrivateAccessPage.css";
import Header from "../components/Header";
import PrivateAccessModal from "../components/PrivateAccessModal"; // Import the PrivateAccessModal component

const PrivateAccessPage = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const navigate = useNavigate();
  const { groupId } = useParams();

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear existing error message

    try {
      const response = await fetch(`/api/groups/${groupId}/verify-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        // On successful password verification, navigate to the group details page
        navigate(`/groups/${groupId}`);
      } else if (response.status === 401) {
        // Handle incorrect password error
        setError("비밀번호가 틀렸습니다");
        setShowModal(true); // Show the modal on error
      } else {
        // Handle other errors
        const errorData = await response.json();
        setError(errorData.message || "비밀번호 확인 중 오류가 발생했습니다.");
        setShowModal(true); // Show the modal on error
      }
    } catch (error) {
      console.error("비밀번호 확인 중 오류 발생:", error);
      setError("비밀번호 확인 중 문제가 발생했습니다.");
      setShowModal(true); // Show the modal on error
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="private-access-page">
      <div className="header-container">
        <Header />
      </div>
      <h1>비공개 그룹</h1>
      <p>비공개 그룹에 접근하기 위해 관련 권한이 필요합니다.</p>
      <form onSubmit={handlePasswordSubmit}>
        <div className="form-group">
          <label htmlFor="password">비밀번호 입력</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="그룹 비밀번호를 입력해 주세요"
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="submit-button">
          제출하기
        </button>
      </form>
      {/* Render the PrivateAccessModal component */}
      <PrivateAccessModal
        show={showModal}
        onClose={handleCloseModal}
        title="비공개 그룹 접근 실패"
        message={error}
      />
    </div>
  );
};

export default PrivateAccessPage;
