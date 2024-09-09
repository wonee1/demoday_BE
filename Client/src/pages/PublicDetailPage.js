import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // useNavigate 훅 추가
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
  const { groupId } = useParams(); // URL에서 그룹 ID 가져옴
  const navigate = useNavigate(); // 페이지 리다이렉트를 위한 useNavigate 훅
  const [groupDetail, setGroupDetail] = useState(null);
  const [posts, setPosts] = useState([]); // Changed from memories to posts
  const [isGroupEditModalOpen, setIsGroupEditModalOpen] = useState(false);
  const [isGroupDeleteModalOpen, setIsGroupDeleteModalOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [sortBy, setSortBy] = useState("latest");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // 그룹 삭제 후 처리 함수
  const handleDeleteGroup = async () => {
    try {
      const response = await axios.delete(`/api/groups/${groupId}`);
      if (response.status === 200) {
        alert("그룹이 성공적으로 삭제되었습니다.");
        navigate("/groups"); // 그룹 목록 페이지로 리다이렉트
      }
    } catch (error) {
      console.error("그룹 삭제 중 오류 발생:", error);
      alert("그룹 삭제 중 오류가 발생했습니다.");
    }
  };

  // groupId가 바뀔 때마다 groupDetail과 posts를 새로 fetch
  useEffect(() => {
    if (groupId) {
      console.log("Fetching details for group ID:", groupId);
      fetchGroupDetail();
      fetchPosts();
    }
  }, [groupId, isPublic, sortBy, page]);

  const fetchGroupDetail = async () => {
    try {
      const response = await axios.get(`/api/groups/${groupId}`);
      if (response.status === 200) {
        setGroupDetail(response.data);
        console.log("Fetched group details:", response.data);
      }
    } catch (error) {
      console.error("그룹 상세 정보 조회 중 오류 발생:", error);
      alert("그룹 상세 정보 조회 중 오류가 발생했습니다.");
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`/api/groups/${groupId}/posts`, {
        params: {
          page,
          pageSize,
          sortBy,
          isPublic,
        },
      });
      if (response.status === 200) {
        setPosts(response.data.data);
        console.log("Fetched posts:", response.data.data);
      }
    } catch (error) {
      console.error("게시글 목록 조회 중 오류 발생:", error);
      alert("게시글 목록 조회 중 오류가 발생했습니다.");
    }
  };

  const handleLikeClick = async () => {
    try {
      const response = await axios.post(`/api/groups/${groupId}/like`);
      if (response.status === 200) {
        alert("공감을 보냈습니다!");
        fetchGroupDetail();
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

  // 그룹 정보 수정 후 처리할 함수
  const handleEditGroupSubmit = (updatedDetails) => {
    setGroupDetail(updatedDetails); // 수정된 정보로 상태 업데이트
    alert('그룹 정보가 성공적으로 수정되었습니다.');
    handleCloseModal(); // 모달 닫기
  };

  if (!groupDetail) return <div>Loading...</div>;

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
              <span> | {groupDetail.isPublic ? "공개" : "비공개"}</span>
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
          <h1 className="group-title">{groupDetail.name}</h1>
          <div className="group-stats">
            <span>추억: {groupDetail.postCount}</span>
            <span> | 그룹 공감: {groupDetail.likeCount}</span>
          </div>
          <p className="group-description">{groupDetail.introduction}</p>
          <div className="badges-container">
            {groupDetail.badges.map((badge, index) => (
              <span key={index} className="badge">
                {badge}
              </span>
            ))}
            <div className="like-button-container">
              <button className="like-button" onClick={handleLikeClick}>
                <img src={LikeIcon} alt="flower icon" className="flower-icon" />{" "}
                공감 보내기
              </button>
            </div>
          </div>
        </div>
      </div>
      <MemoryNav
        groupId={groupId}
        onToggleView={setIsPublic}
        onSortChange={setSortBy}
      />
      <PublicMemory
        groupId={groupId}
        isPublic={isPublic}
        sortBy={sortBy}
        posts={posts} // Changed from memories to posts
      />
      <GroupEditModal
        isOpen={isGroupEditModalOpen}
        onClose={handleCloseModal}
        groupDetails={groupDetail}
        onSubmit={handleEditGroupSubmit} // onSubmit 함수 전달
      />
      <GroupDeleteModal
        isOpen={isGroupDeleteModalOpen}
        onClose={handleCloseModal}
        onDelete={handleDeleteGroup} // 그룹 삭제 후 처리할 함수 전달
        groupId={groupId}
      />
    </div>
  );
};

export default PublicDetailPage;
