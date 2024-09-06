import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import "./MemoryDetailPage.css";
import LikeIcon from "../assets/icon=flower.svg";
import CommentIcon from "../assets/icon=comment.svg";
import MemoryEditModal from "../components/MemoryEditModal";
import MemoryDeleteModal from "../components/MemoryDeleteModal";
import CommentModal from "../components/CommentModal";
import CommentEditModal from "../components/CommentEditModal";
import CommentDeleteModal from "../components/CommentDeleteModal";
import EditIcon from "../assets/icon=edit.svg";
import DeleteIcon from "../assets/icon=delete.svg";

const MemoryDetailPage = () => {
  const { memoryId } = useParams();
  const [memoryDetail, setMemoryDetail] = useState(null);
  const [comments, setComments] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isCommentEditModalOpen, setIsCommentEditModalOpen] = useState(false);
  const [isCommentDeleteModalOpen, setIsCommentDeleteModalOpen] =
    useState(false);
  const [currentComment, setCurrentComment] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 게시글 상세 정보 API 호출
  const fetchMemoryDetail = useCallback(async () => {
    try {
      const response = await axios.get(`/api/posts/${memoryId}`);
      setMemoryDetail(response.data);
    } catch (error) {
      console.error("게시글을 불러오는 중 오류 발생:", error);
    }
  }, [memoryId]);

  // 댓글 목록 API 호출
  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.get(`/api/posts/${memoryId}/comments`, {
        params: { page, pageSize: 5 }, // 페이지당 아이템 수를 5로 설정
      });
      setComments(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("댓글을 불러오는 중 오류 발생:", error);
    }
  }, [memoryId, page]);

  useEffect(() => {
    fetchMemoryDetail();
    fetchComments();
  }, [fetchMemoryDetail, fetchComments]);

  // 공감 보내기 기능
  const handleLikeButtonClick = async () => {
    try {
      await axios.post(`/api/posts/${memoryId}/like`);
      fetchMemoryDetail(); // 공감 수 갱신
    } catch (error) {
      console.error("공감 보내기 실패:", error);
    }
  };

  const handleEditButtonClick = () => {
    setIsEditModalOpen(true);
  };
  const handleDeleteButtonClick = () => {
    setIsDeleteModalOpen(true);
  };
  const handleCommentButtonClick = () => {
    setIsCommentModalOpen(true);
  };
  const handleCommentEditButtonClick = (comment) => {
    setCurrentComment(comment);
    setIsCommentEditModalOpen(true);
  };
  const handleCommentDeleteButtonClick = (comment) => {
    setCurrentComment(comment);
    setIsCommentDeleteModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsCommentModalOpen(false);
    setIsCommentEditModalOpen(false);
    setIsCommentDeleteModalOpen(false);
  };

  if (!memoryDetail) {
    return <div>게시글을 불러오는 중입니다...</div>;
  }

  const actualCommentCount = comments.length;

  return (
    <div className="memory-detail-page">
      <Header />
      <div className="memory-card-detail">
        {/* 게시글 상세 내용 */}
        <div className="memory-header">
          <div className="memory-header-left">
            <p className="nickname">{memoryDetail.nickname}</p>
            <span className="pipe">|</span>
            <span className="public-status">
              {memoryDetail.isPublic ? "공개" : "비공개"}
            </span>
          </div>
          <div className="memory-header-right actions">
            <span className="edit-link" onClick={handleEditButtonClick}>
              추억 수정하기
            </span>
            <span className="delete-link" onClick={handleDeleteButtonClick}>
              추억 삭제하기
            </span>
          </div>
        </div>
        <h1>{memoryDetail.title}</h1>
        <div className="tags">{memoryDetail.tags.join(" ")}</div>
        <div className="memory-meta">
          <div className="memory-meta-left">
            <p className="moment">
              {memoryDetail.location} · {memoryDetail.moment}
            </p>
            <div className="memory-icons">
              <span>
                <img src={LikeIcon} alt="Like" />
                {memoryDetail.likeCount}
              </span>
              <span>
                <img src={CommentIcon} alt="Comment" />
                {actualCommentCount}
              </span>
            </div>
          </div>
          <div className="memory-meta-right">
            <button className="like-button" onClick={handleLikeButtonClick}>
              <img src={LikeIcon} alt="flower icon" className="flower-icon" />
              공감 보내기
            </button>
          </div>
        </div>
        <div className="memory-divider"></div>
        <img src={memoryDetail.imageUrl} alt={memoryDetail.title} />
        <div className="memory-info">
          <p dangerouslySetInnerHTML={{ __html: memoryDetail.content }} />
        </div>
        <button className="comment-button" onClick={handleCommentButtonClick}>
          댓글 등록하기
        </button>
      </div>

      {/* 댓글 목록 */}
      <div className="comments-section">
        <h2>댓글 {actualCommentCount}</h2>
        <div className="memory-divider2"></div>
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="comment">
              <div className="comment-text">
                <span className="comment-nickname">{comment.nickname}</span>
                <span className="comment-date">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
                <p>{comment.content}</p>
              </div>
              <div className="comment-actions">
                <img
                  src={EditIcon}
                  alt="Edit"
                  className="edit-icon"
                  onClick={() => handleCommentEditButtonClick(comment)}
                />
                <img
                  src={DeleteIcon}
                  alt="Delete"
                  className="delete-icon"
                  onClick={() => handleCommentDeleteButtonClick(comment)}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="no-comments">
            <p className="primary-message">등록된 댓글이 없습니다.</p>
            <p className="secondary-message">가장 먼저 댓글을 등록해 보세요!</p>
          </div>
        )}

        {/* 페이지네이션 */}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button key={index + 1} onClick={() => setPage(index + 1)}>
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Modals */}
      <MemoryEditModal isOpen={isEditModalOpen} onClose={handleCloseModal} />
      <MemoryDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
      />
      <CommentModal isOpen={isCommentModalOpen} onClose={handleCloseModal} />
      <CommentEditModal
        isOpen={isCommentEditModalOpen}
        onClose={handleCloseModal}
        commentData={currentComment}
      />
      <CommentDeleteModal
        isOpen={isCommentDeleteModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default MemoryDetailPage;

// import React, { useState } from "react";
// import { useParams } from "react-router-dom";
// import Header from "../components/Header";
// import "./MemoryDetailPage.css";
// import LikeIcon from "../assets/icon=flower.svg";
// import CommentIcon from "../assets/icon=comment.svg";
// import MemoryImg from "../assets/publicmemory.svg"; // Import the image
// import MemoryEditModal from "../components/MemoryEditModal";
// import MemoryDeleteModal from "../components/MemoryDeleteModal";
// import EditIcon from "../assets/icon=edit.svg";
// import DeleteIcon from "../assets/icon=delete.svg";
// import CommentModal from "../components/CommentModal";
// import CommentEditModal from "../components/CommentEditModal";
// import CommentDeleteModal from "../components/CommentDeleteModal";
// // Dummy data (same as in MemoryList)
// const dummyMemories = [
//   {
//     id: 1,
//     nickname: "달봉이아빠",
//     title: "에델바이스 꽃만이 소중한 추억이래요",
//     imageUrl: MemoryImg,
//     tags: ["#추억", "#가족"],
//     location: "서울숲",
//     moment: "2024-02-21",
//     isPublic: true,
//     likeCount: 120,
//     commentCount: 8,
//     createdAt: "2024-02-22",
//     content:
//       "인천 앞바다에서 월척을 낚았어요! 가족들과 함께 좋은 시간을 보냈습니다.<br />" +
//       "인천 앞바다에서 월척을 낚았어요! 가족들과 함께 좋은 시간을 보냈습니다.<br />" +
//       "인천 앞바다에서 월척을 낚았어요! 가족들과 함께 좋은 시간을 보냈습니다.<br />" +
//       "인천 앞바다에서 월척을 낚았어요! 가족들과 함께 좋은 시간을 보냈습니다.",
//     comments: [
//       { nickname: "사용자1", date: "2024-02-22", content: "멋진 추억이네요!" },
//       { nickname: "사용자2", date: "2024-02-23", content: "좋아요!" },
//     ],
//   },
//   {
//     id: 2,
//     nickname: "달봉이엄마",
//     title: "서울숲 소풍",
//     imageUrl: MemoryImg,
//     tags: ["#소풍", "#서울숲"],
//     location: "서울숲",
//     moment: "2024-02-21",
//     isPublic: true,
//     likeCount: 110,
//     commentCount: 5,
//     createdAt: "2024-02-20",
//     content:
//       "서울숲에서 소풍을 즐겼어요! 가족들과 함께 행복한 시간을 보냈습니다.",
//     comments: [
//       {
//         nickname: "사용자3",
//         date: "2024-02-20",
//         content: "좋은 시간 보내셨네요!",
//       },
//       {
//         nickname: "사용자4",
//         date: "2024-02-21",
//         content: "추억 공유해주셔서 감사합니다.",
//       },
//     ],
//   },
// ];

// const MemoryDetailPage = () => {
//   const { memoryId } = useParams();
//   const memoryDetail = dummyMemories.find(
//     (memory) => memory.id === parseInt(memoryId)
//   );

//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
//   const [isCommentEditModalOpen, setIsCommentEditModalOpen] = useState(false);
//   const [isCommentDeleteModalOpen, setIsCommentDeleteModalOpen] =
//     useState(false);
//   const [currentComment, setCurrentComment] = useState(null);
//   const handleEditButtonClick = () => {
//     setIsEditModalOpen(true);
//   };
//   const handleDeleteButtonClick = () => {
//     setIsDeleteModalOpen(true); // Open delete modal
//   };
//   const handleCommentButtonClick = () => {
//     setIsCommentModalOpen(true); // Open the comment modal
//   };
//   const handleCommentEditButtonClick = (comment) => {
//     setCurrentComment(comment);
//     setIsCommentEditModalOpen(true); // Open the comment edit modal
//   };
//   const handleCommentDeleteButtonClick = () => {
//     setIsCommentDeleteModalOpen(true); // 댓글 삭제 모달 열기
//   };
//   const handleCloseModal = () => {
//     setIsEditModalOpen(false);
//     setIsDeleteModalOpen(false);
//     setIsCommentModalOpen(false);
//     setIsCommentEditModalOpen(false);
//     setIsCommentDeleteModalOpen(false);
//   };

//   const handleFormSubmit = (formData) => {
//     console.log("Form submitted with:", formData);
//     // Handle the form submission logic, e.g., updating the memory details
//     setIsEditModalOpen(false);
//   };

//   const handlePostDeletion = () => {
//     console.log("Post deleted successfully");
//     // Implement any additional logic after deletion, e.g., redirecting
//     handleCloseModal();
//   };
//   const handleCommentSubmit = (commentData) => {
//     console.log("Comment submitted with:", commentData);
//     setIsCommentModalOpen(false);
//     // Handle comment submission logic
//   };
//   const handleCommentUpdate = (updatedCommentData) => {
//     console.log("Comment updated with:", updatedCommentData);
//     setIsCommentEditModalOpen(false);
//     // Handle comment update logic
//   };
//   const handleCommentDelete = (password) => {
//     console.log("Comment deleted with password:", password);
//     setIsCommentDeleteModalOpen(false);
//   };
//   if (!memoryDetail) {
//     return <div>Memory not found</div>;
//   }

//   const actualCommentCount = memoryDetail.comments
//     ? memoryDetail.comments.length
//     : 0;

//   return (
//     <div className="memory-detail-page">
//       <Header />
//       <div className="memory-card-detail">
//         <div className="memory-header">
//           <div className="memory-header-left">
//             <p className="nickname">
//               {memoryDetail.nickname} <span className="pipe">|</span>{" "}
//               <span className="public-status">
//                 {memoryDetail.isPublic ? "공개" : "비공개"}
//               </span>
//             </p>
//           </div>
//           <div className="memory-header-right actions">
//             <span className="edit-link" onClick={handleEditButtonClick}>
//               추억 수정하기
//             </span>
//             <span className="delete-link" onClick={handleDeleteButtonClick}>
//               추억 삭제하기
//             </span>
//           </div>
//         </div>
//         <h1>{memoryDetail.title}</h1>
//         <div className="tags">{memoryDetail.tags.join(" ")}</div>
//         <div className="memory-meta">
//           <div className="memory-meta-left">
//             <p className="moment">
//               {memoryDetail.location} · {memoryDetail.moment}
//             </p>
//             <div className="memory-icons">
//               <span>
//                 <img src={LikeIcon} alt="Like" />
//                 {memoryDetail.likeCount}
//               </span>
//               <span>
//                 <img src={CommentIcon} alt="Comment" />
//                 {actualCommentCount}
//               </span>
//             </div>
//           </div>
//           <div className="memory-meta-right">
//             <button className="like-button">
//               <img src={LikeIcon} alt="flower icon" className="flower-icon" />
//               공감 보내기
//             </button>
//           </div>
//         </div>
//         <div className="memory-divider"></div> {/* 구분선 추가 */}
//         <img src={memoryDetail.imageUrl} alt={memoryDetail.title} />
//         <div className="memory-info">
//           <p dangerouslySetInnerHTML={{ __html: memoryDetail.content }} />
//         </div>
//         <button className="comment-button" onClick={handleCommentButtonClick}>
//           댓글 등록하기
//         </button>{" "}
//         {/* 댓글 등록하기 버튼 */}
//       </div>

//       <div className="comments-section">
//         <h2>댓글 {actualCommentCount}</h2>
//         <div className="memory-divider2"></div>
//         {memoryDetail.comments && memoryDetail.comments.length > 0 ? (
//           memoryDetail.comments.map((comment, index) => (
//             <div key={index} className="comment">
//               <div className="comment-text">
//                 <span className="comment-nickname">{comment.nickname}</span>
//                 <span className="comment-date">{comment.date}</span>
//                 <p>{comment.content}</p>
//               </div>
//               <div className="comment-actions">
//                 <img
//                   src={EditIcon}
//                   alt="Edit"
//                   className="edit-icon"
//                   onClick={() => handleCommentEditButtonClick(comment)}
//                 />
//                 <img
//                   src={DeleteIcon}
//                   alt="Delete"
//                   className="delete-icon"
//                   onClick={handleCommentDeleteButtonClick}
//                 />
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="no-comments">
//             <p className="primary-message">등록된 댓글이 없습니다.</p>
//             <p className="secondary-message">가장 먼저 댓글을 등록해 보세요!</p>
//           </div>
//         )}
//       </div>

//       {/* MemoryEditModal Component */}
//       <MemoryEditModal
//         isOpen={isEditModalOpen}
//         onClose={handleCloseModal}
//         onSubmit={handleFormSubmit}
//         memoryDetails={memoryDetail} // Passing the current memory details to the modal
//       />
//       <MemoryDeleteModal
//         isOpen={isDeleteModalOpen}
//         onClose={handleCloseModal}
//         onDelete={handlePostDeletion} // Handling the deletion logic
//         postId={memoryDetail.id} // Pass the post ID to the modal
//       />
//       <CommentModal
//         isOpen={isCommentModalOpen}
//         onClose={handleCloseModal}
//         onSubmit={handleCommentSubmit}
//       />
//       <CommentEditModal
//         isOpen={isCommentEditModalOpen}
//         onClose={handleCloseModal}
//         onSubmit={handleCommentUpdate}
//         commentData={currentComment} // Pass the current comment data to the modal
//       />
//       <CommentDeleteModal
//         isOpen={isCommentDeleteModalOpen}
//         onClose={handleCloseModal}
//         onDelete={handleCommentDelete}
//       />
//     </div>
//   );
// };

// export default MemoryDetailPage;
