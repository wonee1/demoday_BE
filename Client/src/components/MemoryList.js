import React from "react";
import "./MemoryList.css";
import MemoryImg from "../assets/publicmemory.svg";
import emptyIcon from "../assets/type=memory.svg";
import LikeIcon from "../assets/icon=flower.svg";
import CommentIcon from "../assets/icon=comment.svg"; // 댓글 아이콘 임포트
import { useNavigate } from "react-router-dom";

const dummyMemories = [
  {
    id: 1,
    nickname: "달봉이아빠",
    title: "에델바이스 꽃만이 소중한 추억이래요",
    imageUrl: MemoryImg,
    tags: ["#추억", "#가족"],
    location: "서울숲",
    moment: "2024-02-21",
    isPublic: true,
    likeCount: 120,
    commentCount: 8,
    createdAt: "2024-02-22",
  },
  // 더 많은 더미 데이터 추가 가능
];

const MemoryList = ({ isPublic, sortBy }) => {
  const navigate = useNavigate();

  const filteredMemories = dummyMemories.filter(
    (memory) => memory.isPublic === isPublic
  );

  const handleUploadClick = () => {
    navigate("/upload-memory");
  };
  const handleCardClick = (memoryId) => {
    navigate(`/memories/${memoryId}`);
  };
  const sortedMemories = filteredMemories.sort((a, b) => {
    if (sortBy === "mostLiked") {
      return b.likeCount - a.likeCount;
    } else if (sortBy === "mostCommented") {
      return b.commentCount - a.commentCount;
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  return (
    <div className="public-memory-list">
      {sortedMemories.length > 0 ? (
        sortedMemories.map((memory) => (
          <div
            key={memory.id}
            className="memory-card"
            onClick={() => handleCardClick(memory.id)}
          >
            <img src={memory.imageUrl} alt={memory.title} />
            <div className="memory-info">
              <p className="nickname">
                {memory.nickname} <span className="pipe">|</span>{" "}
                <span className="public-status">
                  {memory.isPublic ? "공개" : "비공개"}
                </span>
              </p>
              <h2>{memory.title}</h2>
              <div className="tags">{memory.tags.join(" ")}</div>
              <div className="like-comment-container">
                <p className="moment">
                  {memory.location} · {memory.moment}
                </p>
                <div className="like-comment">
                  <span>
                    <img src={LikeIcon} alt="Like" />
                    {memory.likeCount}
                  </span>
                  <span>
                    <img src={CommentIcon} alt="Comment" />
                    {memory.commentCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="empty-state">
          <img src={emptyIcon} alt="Empty" />
          <button onClick={handleUploadClick}>추억 올리기</button>
        </div>
      )}
    </div>
  );
};

export default MemoryList;

//API 받아올때
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./PublicMemory.css";

// const PublicMemory = ({ groupId, isPublic, sortBy }) => {
//   const [memories, setMemories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchMemories = async () => {
//       try {
//         const response = await axios.get(`/api/groups/${groupId}/posts`, {
//           params: {
//             isPublic,
//             sortBy,
//             page: 1, // 첫 페이지
//             pageSize: 10, // 페이지당 10개 아이템
//           },
//         });
//         setMemories(response.data.data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMemories();
//   }, [groupId, isPublic, sortBy]);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <div className="memory-list">
//       {memories.length > 0 ? (
//         memories.map((memory) => (
//           <div key={memory.id} className="memory-card">
//             <img
//               src={memory.imageUrl}
//               alt={memory.title}
//               className="memory-image"
//             />
//             <div className="memory-info">
//               <h2>{memory.title}</h2>
//               <p>{memory.nickname}</p>
//               <p>{new Date(memory.moment).toLocaleDateString()}</p>
//               <p>
//                 Likes: {memory.likeCount} | Comments: {memory.commentCount}
//               </p>
//               <p>Tags: {memory.tags.join(", ")}</p>
//             </div>
//           </div>
//         ))
//       ) : (
//         <p>No memories found.</p>
//       )}
//     </div>
//   );
// };

// export default PublicMemory;
