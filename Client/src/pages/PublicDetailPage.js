import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PublicDetailPage.css";
import Header from "../components/Header";
import PublicMemory from "../components/MemoryList";
import GroupEditModal from "../components/GroupEditModal";
import GroupDeleteModal from "../components/GroupDeleteModal";
import MemoryNav from "../components/MemoryNav";
import img2 from "../assets/image=img2.svg";
import LikeIcon from "../assets/icon=flower.svg";

const PublicDetailPage = () => {
  const [groupDetail, setGroupDetail] = useState(null); // 그룹 상세 정보를 저장할 state
  const [memories, setMemories] = useState([]); // 게시글 목록 저장
  const [isGroupEditModalOpen, setIsGroupEditModalOpen] = useState(false);
  const [isGroupDeleteModalOpen, setIsGroupDeleteModalOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [sortBy, setSortBy] = useState("latest");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10); // 페이지당 아이템 수

  const groupId = 1; // 현재 그룹 ID. 실제로는 동적으로 받아와야 할 수 있음.

  useEffect(() => {
    fetchGroupDetail();
    fetchMemories();
  }, [isPublic, sortBy, page]);

  // 그룹 상세 정보 조회 API 호출
  const fetchGroupDetail = async () => {
    try {
      const response = await axios.get(`/api/groups/${groupId}`);
      if (response.status === 200) {
        setGroupDetail(response.data);
      }
    } catch (error) {
      console.error("그룹 상세 정보 조회 중 오류 발생:", error);
      alert("그룹 상세 정보 조회 중 오류가 발생했습니다.");
    }
  };

  // 게시글 목록 조회 API 호출
  const fetchMemories = async () => {
    try {
      const response = await axios.get(`/api/groups/${groupId}/posts`, {
        params: {
          page: page,
          pageSize: pageSize,
          sortBy: sortBy,
          isPublic: isPublic,
        },
      });
      if (response.status === 200) {
        setMemories(response.data.data); // 게시글 목록 저장
      }
    } catch (error) {
      console.error("게시글 목록 조회 중 오류 발생:", error);
      alert("게시글 목록 조회 중 오류가 발생했습니다.");
    }
  };

  // 그룹 공감하기 API 호출
  const handleLikeClick = async () => {
    try {
      const response = await axios.post(`/api/groups/${groupId}/like`);
      if (response.status === 200) {
        alert("공감을 보냈습니다!");
        fetchGroupDetail(); // 공감 수 갱신을 위해 그룹 상세 정보 다시 조회
      }
    } catch (error) {
      console.error("공감 보내기 중 오류 발생:", error);
      alert("공감 보내기 중 오류가 발생했습니다.");
    }
  };

  const handleGroupEditButtonClick = () => {
    setIsGroupEditModalOpen(true);
  };

  const handleGroupDeleteButtonClick = () => {
    setIsGroupDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsGroupEditModalOpen(false);
    setIsGroupDeleteModalOpen(false);
  };

  const handleFormSubmit = (formData) => {
    console.log("Form submitted with:", formData);
    setIsGroupEditModalOpen(false);
  };

  const handleGroupDelete = (password) => {
    console.log("Delete initiated with password:", password);
  };

  const handleToggleView = (viewPrivate) => {
    setIsPublic(!viewPrivate);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  if (!groupDetail) return <div>Loading...</div>; // 데이터 로딩 중 처리

  return (
    <div className="public-detail-page">
      <Header />
      <div className="group-header">
        <img src={groupDetail.imageUrl || img2} alt={groupDetail.name} />
        <div className="group-info">
          <div className="group-details">
            <div>
              <span>
                D+
                {Math.floor(
                  (new Date() - new Date(groupDetail.createdAt)) /
                    (1000 * 60 * 60 * 24)
                )}
              </span>
              <span> | </span>
              <span>{groupDetail.isPublic ? "공개" : "비공개"}</span>
            </div>
            <div className="action-buttons">
              <button onClick={handleGroupEditButtonClick}>
                그룹 정보 수정하기
              </button>
              <button onClick={handleGroupDeleteButtonClick}>
                그룹 삭제하기
              </button>
            </div>
          </div>
          <div className="group-title-stats">
            <h1 className="group-title">{groupDetail.name}</h1>
            <div className="group-stats">
              <span>추억 : {groupDetail.postCount}</span>
              <span> | </span>
              <span>그룹 공감 : {groupDetail.likeCount}</span>
            </div>
          </div>
          <p className="group-description">{groupDetail.introduction}</p>
          <div className="badges-container">
            <div className="badges">
              {groupDetail.badges.map((badge, index) => (
                <span key={index} className="badge">
                  {badge}
                </span>
              ))}
            </div>
            <div className="like-button-container">
              <button className="like-button" onClick={handleLikeClick}>
                <img src={LikeIcon} alt="flower icon" className="flower-icon" />
                공감 보내기
              </button>
            </div>
          </div>
        </div>
      </div>
      <MemoryNav
        onToggleView={handleToggleView}
        onSortChange={handleSortChange}
      />
      <PublicMemory isPublic={isPublic} sortBy={sortBy} memories={memories} />

      <GroupEditModal
        isOpen={isGroupEditModalOpen}
        onClose={handleCloseModal}
        groupDetails={groupDetail}
        onSubmit={handleFormSubmit}
      />
      <GroupDeleteModal
        isOpen={isGroupDeleteModalOpen}
        onClose={handleCloseModal}
        onDelete={handleGroupDelete}
      />
    </div>
  );
};

export default PublicDetailPage;

//api 이전 버전
// import React, { useState } from "react";
// //import { useNavigate } from "react-router-dom";
// import "./PublicDetailPage.css";
// import Header from "../components/Header";
// import PublicMemory from "../components/MemoryList";
// import GroupEditModal from "../components/GroupEditModal";
// import GroupDeleteModal from "../components/GroupDeleteModal";
// import MemoryNav from "../components/MemoryNav";
// import img2 from "../assets/image=img2.svg";
// import LikeIcon from "../assets/icon=flower.svg";

// const dummyGroupDetail = {
//   id: 1,
//   name: "달봉이네 가족",
//   imageUrl: img2,
//   description: "서로 한 마음으로 응원하고 아끼는 달봉이네 가족입니다.",
//   daysSinceCreation: 265,
//   badges: [
//     "7일 연속 추억 등록",
//     "그룹 공감 1만 이상 받기",
//     "게시글 공감 1만 이상 받기",
//   ],
//   memories: 8,
//   likes: 1.5,
// };

// const PublicDetailPage = () => {
//   //const navigate = useNavigate();
//   const [groupDetail] = useState(dummyGroupDetail);
//   const [isGroupEditModalOpen, setIsGroupEditModalOpen] = useState(false);
//   const [isGroupDeleteModalOpen, setIsGroupDeleteModalOpen] = useState(false);
//   const [isPublic, setIsPublic] = useState(true);
//   const [sortBy, setSortBy] = useState("latest");

//   const handleGroupEditButtonClick = () => {
//     setIsGroupEditModalOpen(true);
//   };

//   const handleGroupDeleteButtonClick = () => {
//     setIsGroupDeleteModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsGroupEditModalOpen(false);
//     setIsGroupDeleteModalOpen(false);
//   };

//   const handleFormSubmit = (formData) => {
//     console.log("Form submitted with:", formData);
//     setIsGroupEditModalOpen(false);
//   };

//   const handleGroupDelete = (password) => {
//     console.log("Delete initiated with password:", password);
//   };

//   // const handleUploadClick = () => {
//   //   navigate("/upload-memory");
//   // };

//   const handleLikeClick = async () => {
//     try {
//       alert("공감을 보냈습니다!");
//     } catch (error) {
//       console.error("공감 보내기 중 오류 발생:", error);
//       alert("공감 보내기 중 오류가 발생했습니다.");
//     }
//   };

//   const handleToggleView = (viewPrivate) => {
//     setIsPublic(!viewPrivate);
//   };

//   const handleSortChange = (e) => {
//     setSortBy(e.target.value);
//   };

//   return (
//     <div className="public-detail-page">
//       <Header />
//       <div className="group-header">
//         <img src={groupDetail.imageUrl} alt={groupDetail.name} />
//         <div className="group-info">
//           <div className="group-details">
//             <div>
//               <span>D+{groupDetail.daysSinceCreation}</span>
//               <span> | </span>
//               <span>공개</span>
//             </div>
//             <div className="action-buttons">
//               <button onClick={handleGroupEditButtonClick}>
//                 그룹 정보 수정하기
//               </button>
//               <button onClick={handleGroupDeleteButtonClick}>
//                 그룹 삭제하기
//               </button>
//             </div>
//           </div>
//           <div className="group-title-stats">
//             <h1 className="group-title">{groupDetail.name}</h1>
//             <div className="group-stats">
//               <span>추억 : {groupDetail.memories}</span>
//               <span> | </span>
//               <span>그룹 공감 : {groupDetail.likes}K</span>
//             </div>
//           </div>
//           <p className="group-description">{groupDetail.description}</p>
//           <div className="badges-container">
//             <div className="badges">
//               {groupDetail.badges.map((badge, index) => (
//                 <span key={index} className="badge">
//                   {badge}
//                 </span>
//               ))}
//             </div>
//             <div className="like-button-container">
//               <button className="like-button" onClick={handleLikeClick}>
//                 <img src={LikeIcon} alt="flower icon" className="flower-icon" />
//                 공감 보내기
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <MemoryNav
//         onToggleView={handleToggleView}
//         onSortChange={handleSortChange}
//       />
//       <PublicMemory isPublic={isPublic} sortBy={sortBy} />

//       <GroupEditModal
//         isOpen={isGroupEditModalOpen}
//         onClose={handleCloseModal}
//         groupDetails={groupDetail}
//         onSubmit={handleFormSubmit}
//       />
//       <GroupDeleteModal
//         isOpen={isGroupDeleteModalOpen}
//         onClose={handleCloseModal}
//         onDelete={handleGroupDelete}
//       />
//     </div>
//   );
// };

// export default PublicDetailPage;
