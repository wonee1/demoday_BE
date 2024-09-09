import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateGroupPage from "./pages/CreateGroupPage";
import PrivateAccessPage from "./pages/PrivateAccessPage";
import PublicDetailPage from "./pages/PublicDetailPage"; // 그룹 상세 페이지
import UploadMemory from "./pages/UploadMemory"; // 추억 올리기 페이지
// import NotFoundPage from "./pages/NotFoundPage"; // 404 페이지 (필요시 주석 해제)
import MemoryDetailPage from "./pages/MemoryDetailPage"; // 메모리 상세 페이지

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-group" element={<CreateGroupPage />} />
        <Route
          path="/groups/:groupId/private-access"
          element={<PrivateAccessPage />}
        />
        <Route path="/groups/:groupId" element={<PublicDetailPage />} /> {/* 그룹 상세 페이지 */}
        <Route path="/groups/:groupId/upload-memory" element={<UploadMemory />} /> {/* 추억 올리기 */}
        <Route path="/memories/:memoryId" element={<MemoryDetailPage />} /> {/* 메모리 상세 페이지 */}
        {/* <Route path="*" element={<NotFoundPage />} /> 404 페이지 (필요시 활성화) */}
      </Routes>
    </Router>
  );
}

export default App;
