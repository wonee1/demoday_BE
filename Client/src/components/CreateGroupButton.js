import React from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 훅 임포트
import "./CreateGroupButton.css"; // 버튼 스타일

const CreateGroupButton = ({ className }) => {
  // className을 props로 받아옴
  const navigate = useNavigate(); // navigate 함수 생성

  const handleClick = () => {
    navigate("/create-group"); // 클릭 시 "/create-group" 경로로 이동
  };

  return (
    <button
      className={`create-group-button ${className}`}
      onClick={handleClick}
    >
      그룹 만들기
    </button>
  );
};

export default CreateGroupButton;
