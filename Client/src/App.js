// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import HomePage from "./pages/HomePage";
// import CreateGroupPage from "./pages/CreateGroupPage";
// import PrivateAccessPage from "./pages/PrivateAccessPage";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/create-group" element={<CreateGroupPage />} />
//         <Route
//           path="/groups/:groupId/private-access"
//           element={<PrivateAccessPage />}
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateGroupPage from "./pages/CreateGroupPage";
import PrivateAccessPage from "./pages/PrivateAccessPage";
import PublicDetailPage from "./pages/PublicDetailPage"; // 그룹 상세 페이지 임포트
import UploadMemory from "./pages/UploadMemory"; // 추억 올리기 페이지 임포트
//import NotFoundPage from "./pages/NotFoundPage";

import MemoryDetailPage from "./pages/MemoryDetailPage";

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
        <Route path="/groups/:groupId" element={<PublicDetailPage />} />{" "}
        {/* 그룹 상세 페이지 라우트 추가 */}
        <Route path="/upload-memory" element={<UploadMemory />} />{" "}
        {/* 추억 올리기 페이지 라우트 추가 */}
        {/* <Route path="*" element={<NotFoundPage />} /> 404 페이지 라우트 */}
        <Route path="/memories/:memoryId" element={<MemoryDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
