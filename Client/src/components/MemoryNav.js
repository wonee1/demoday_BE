import React from "react";
import "./MemoryNav.css";
import { ReactComponent as SearchIcon } from "../assets/icon=search.svg";
import { useNavigate } from "react-router-dom";
const MemoryNav = ({ groupId, viewPrivate, onToggleView, onSortChange }) => {
  const navigate = useNavigate();
  const handleButtonClick = (view) => {
    onToggleView(view === "private");
  };

  const handleSortChange = (event) => {
    onSortChange(event.target.value);
  };
  const handleUploadClick = () => {
    if (groupId) {
      console.log("Navigating to upload-memory with groupId:", groupId); // 로그 추가
      navigate(`/groups/${groupId}/upload-memory`);
    } else {
      console.log("No groupId provided");
      alert("그룹 ID가 없습니다.");
    }
  };

  return (
    <div className="memory-header-container">
      <div className="memory-nav-header">
        <h2 className="memory-nav-title">추억 목록</h2>
        <button className="uploadmemory-button" onClick={handleUploadClick}>
          추억 올리기
        </button>
      </div>
      <div className="memory-navbar-container">
        <div className="memory-button-group">
          <button
            className={`memory-nav-button ${!viewPrivate ? "active" : ""}`}
            onClick={() => handleButtonClick("public")}
          >
            공개
          </button>
          <button
            className={`memory-nav-button ${viewPrivate ? "active" : ""}`}
            onClick={() => handleButtonClick("private")}
          >
            비공개
          </button>
        </div>
        <div className="memory-search-container">
          <SearchIcon width="20px" height="20px" />
          <input
            className="search-input"
            placeholder="태그 혹은 제목을 입력해 주세요"
          />
        </div>
        <select className="memory-sort-dropdown" onChange={handleSortChange}>
          <option value="likes">공감순</option>
          <option value="recent">최신순</option>
          <option value="post">게시글 많은순</option>
          <option value="badge">획득 배지순</option>
        </select>
      </div>
    </div>
  );
};
export default MemoryNav;
