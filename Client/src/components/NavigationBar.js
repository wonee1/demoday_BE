// src/components/NavigationBar.js
import React from "react";
import "./NavigationBar.css"; // CSS 파일을 임포트
import { ReactComponent as SearchIcon } from "../assets/icon=search.svg";
const NavigationBar = ({ viewPrivate, onToggleView, onSortChange }) => {
  const handleButtonClick = (view) => {
    onToggleView(view === "private");
  };

  const handleSortChange = (event) => {
    onSortChange(event.target.value);
  };

  return (
    <div className="navbar-container">
      <div className="button-group">
        <button
          className={`nav-button ${!viewPrivate ? "active" : ""}`}
          onClick={() => handleButtonClick("public")}
        >
          공개
        </button>
        <button
          className={`nav-button ${viewPrivate ? "active" : ""}`}
          onClick={() => handleButtonClick("private")}
        >
          비공개
        </button>
      </div>
      <div className="search-container">
        <SearchIcon width="20px" height="20px" />
        <input className="search-input" placeholder="그룹명을 검색해 주세요" />
      </div>
      <select className="sort-dropdown" onChange={handleSortChange}>
        <option value="likes">공감순</option>
        <option value="recent">최신순</option>
        <option value="post">게시글 많은순</option>
        <option value="badge">획득 배지순</option>
      </select>
    </div>
  );
};

export default NavigationBar;
