// src/components/Header.js
import React from "react";
import "./Header.css"; // CSS 파일을 임포트
import { ReactComponent as Logo } from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const navigate = useNavigate(); // navigate 함수 생성

  const handleLogoClick = () => {
    navigate("/"); // 로고 클릭 시 홈페이지로 이동
  };

  return (
    <header className="header-container">
      <div
        className="logo-container"
        onClick={handleLogoClick}
        style={{ cursor: "pointer" }}
      >
        <Logo className="logo-image" />
      </div>
    </header>
  );
};

export default Header;
