// src/pages/HomePage.js
import React, { useState } from "react";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import PublicCardList from "../components/PublicCardList";
import PrivateCardList from "../components/PrivateCardList";
import CreateGroupButton from "../components/CreateGroupButton"; // "그룹 만들기" 버튼 컴포넌트 임포트
import "./HomePage.css";

function HomePage() {
  const [viewPrivate, setViewPrivate] = useState(false);
  const [sortKey, setSortKey] = useState("likes");
  const [keyword, setKeyword] = useState("");

  const handleToggleView = (isPrivate) => {
    setViewPrivate(isPrivate);
  };

  const handleSortChange = (newSortKey) => {
    setSortKey(newSortKey);
  };

  const handleSearch = (newKeyword) => {
    setKeyword(newKeyword);
  };

  return (
    <div className="homePage">
      <div className="header-container">
        <Header />
        <CreateGroupButton className="header-create-group-button" />{" "}
        {/* "그룹 만들기" 버튼을 헤더 옆에 배치 */}
      </div>
      <NavigationBar
        viewPrivate={viewPrivate}
        onToggleView={handleToggleView}
        onSortChange={handleSortChange}
        onSearch={handleSearch}
      />
      <div className="groupCardListContainer">
        {viewPrivate ? (
          <PrivateCardList sortKey={sortKey} keyword={keyword} />
        ) : (
          <PublicCardList sortKey={sortKey} keyword={keyword} />
        )}
      </div>
    </div>
  );
}

export default HomePage;

// import React, { useState } from "react";
// import Header from "../components/Header";
// import NavigationBar from "../components/NavigationBar";
// import PublicCardList from "../components/PublicCardList";
// import PrivateCardList from "../components/PrivateCardList";
// import "./HomePage.css";

// function HomePage() {
//   const [viewPrivate, setViewPrivate] = useState(false); // 공개/비공개 토글 상태
//   const [sortKey, setSortKey] = useState("likes"); // 정렬 기준 상태

//   // 네비게이션바에서 선택한 값을 받아 상태 변경
//   const handleToggleView = (isPrivate) => {
//     setViewPrivate(isPrivate);
//   };

//   // 네비게이션바에서 정렬 기준을 받아 상태 변경
//   const handleSortChange = (newSortKey) => {
//     setSortKey(newSortKey);
//   };

//   return (
//     <div className="homePage">
//       <Header />

//       <NavigationBar
//         viewPrivate={viewPrivate}
//         onToggleView={handleToggleView}
//         onSortChange={handleSortChange} // 정렬 기준 전달
//       />

//       <div className="groupCardListContainer">
//         {viewPrivate ? (
//           <PrivateCardList sortKey={sortKey} /> // 정렬 기준 전달
//         ) : (
//           <PublicCardList sortKey={sortKey} /> // 정렬 기준 전달
//         )}
//       </div>
//     </div>
//   );
// }

// export default HomePage;
