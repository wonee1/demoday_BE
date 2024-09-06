import React, { useState, useEffect } from "react";
import "./PublicCardList.css";
import PublicCard from "./PublicCard";
import { fetchGroups } from "../api"; // API 호출 함수 임포트
import { ReactComponent as NoGroupIcon } from "../assets/type=group.svg"; // 빈 화면 아이콘
import CreateGroupButton from "../components/CreateGroupButton";

const PublicCardList = ({ sortKey, keyword }) => {
  const [groups, setGroups] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadGroups = async () => {
      setLoading(true);
      try {
        const response = await fetchGroups({
          isPublic: true, // 공개된 그룹만 조회
          sortBy: sortKey,
          keyword,
          page,
          pageSize: 10,
        });
        setGroups((prevGroups) => [...prevGroups, ...response.data]);
        setHasMore(response.currentPage < response.totalPages);
      } catch (error) {
        console.error("Failed to load groups:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, [sortKey, keyword, page]);

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <>
      {groups.length === 0 && !loading ? (
        <div className="empty-state-container">
          <NoGroupIcon className="no-group-icon" />
          <div className="create-button-wrapper">
            <CreateGroupButton className="empty-create-group-button" />
          </div>
        </div>
      ) : (
        <div className="group-list-container">
          {groups.map((group) => (
            <PublicCard key={group.id} group={group} />
          ))}
        </div>
      )}
      {hasMore && groups.length > 0 && (
        <button
          className="load-more-button"
          onClick={loadMore}
          disabled={loading}
        >
          {loading ? "로딩 중..." : "더보기"}
        </button>
      )}
    </>
  );
};

export default PublicCardList;

// api 이전
// import React, { useState, useEffect } from "react";
// import "./PublicCardList.css";
// import PublicCard from "./PublicCard";
// import { fetchGroups } from "../api"; // API 호출 함수 임포트
// import { ReactComponent as NoGroupIcon } from "../assets/type=group.svg"; // 빈 화면 아이콘
// import CreateGroupButton from "../components/CreateGroupButton";

// import { ReactComponent as img1 } from "../assets/Rectangle 14.svg";
// import { ReactComponent as img2 } from "../assets/image=img2.svg";
// import { ReactComponent as img3 } from "../assets/Rectangle 22.svg";
// //import { ReactComponent as img5 } from "../assets/image=img5.svg";
// //import { ReactComponent as img6 } from "../assets/Rectangle 14.svg";
// //import { ReactComponent as img7 } from "../assets/Rectangle 22.svg";

// // 초기 카드 데이터
// const initialGroups = [
//   {
//     id: 1,
//     name: "에델바이스",
//     image: img1,
//     description: "서로 한 마음으로 응원하고 아끼는 달봉이네 가족입니다.",
//     isPublic: true,
//     daysSinceCreation: 265,
//     badges: 2,
//     memories: 8,
//     likes: 1.5,
//   },
//   {
//     id: 2,
//     name: "소중한 추억",
//     image: img3,
//     description: "서로 한 마음으로 응원하고 아끼는 달봉이네 가족입니다.",
//     isPublic: true,
//     daysSinceCreation: 265,
//     badges: 2,
//     memories: 8,
//     likes: 1.5,
//   },
//   {
//     id: 3,
//     name: "달봉이네 가족",
//     description: "서로 한 마음으로 응원하고 아끼는 달봉이네 가족입니다.",
//     isPublic: true,
//     daysSinceCreation: 265,
//     badges: 2,
//     memories: 8,
//     likes: 1.5,
//   },
//   {
//     id: 4,
//     name: "달봉이네 가족",
//     image: img2,
//     description: "서로 한 마음으로 응원하고 아끼는 달봉이네 가족입니다.",
//     isPublic: true,
//     daysSinceCreation: 265,
//     badges: 2,
//     memories: 8,
//     likes: 1.5,
//   },
//   {
//     id: 5,
//     name: "에델바이스",
//     image: img1,
//     description: "서로 한 마음으로 응원하고 아끼는 달봉이네 가족입니다.",
//     isPublic: true,
//     daysSinceCreation: 265,
//     badges: 2,
//     memories: 8,
//     likes: 1.5,
//   },
//   {
//     id: 6,
//     name: "달봉이네 가족",
//     image: img2,
//     description: "서로 한 마음으로 응원하고 아끼는 달봉이네 가족입니다.",
//     isPublic: true,
//     daysSinceCreation: 265,
//     badges: 2,
//     memories: 8,
//     likes: 1.5,
//   },
//   {
//     id: 7,
//     name: "소중한 추억",
//     image: img3,
//     description: "서로 한 마음으로 응원하고 아끼는 달봉이네 가족입니다.",
//     isPublic: true,
//     daysSinceCreation: 265,
//     badges: 2,
//     memories: 8,
//     likes: 1.5,
//   },
//   {
//     id: 8,
//     name: "달봉이네 가족",
//     description: "서로 한 마음으로 응원하고 아끼는 달봉이네 가족입니다.",
//     isPublic: true,
//     daysSinceCreation: 265,
//     badges: 2,
//     memories: 8,
//     likes: 1.5,
//   },
//   {
//     id: 9,
//     name: "달봉이네 가족",
//     image: img2,
//     description: "서로 한 마음으로 응원하고 아끼는 달봉이네 가족입니다.",
//     isPublic: true,
//     daysSinceCreation: 265,
//     badges: 2,
//     memories: 8,
//     likes: 1.5,
//   },
//   {
//     id: 10,
//     name: "달봉이네 가족",
//     description: "서로 한 마음으로 응원하고 아끼는 달봉이네 가족입니다.",
//     isPublic: true,
//     daysSinceCreation: 265,
//     badges: 2,
//     memories: 8,
//     likes: 1.5,
//   },
//   {
//     id: 11,
//     name: "에델바이스",
//     image: img1,
//     description: "서로 한 마음으로 응원하고 아끼는 달봉이네 가족입니다.",
//     isPublic: true,
//     daysSinceCreation: 265,
//     badges: 2,
//     memories: 8,
//     likes: 1.5,
//   },
//   {
//     id: 12,
//     name: "달봉이네 가족",
//     image: img2,
//     description: "서로 한 마음으로 응원하고 아끼는 달봉이네 가족입니다.",
//     isPublic: true,
//     daysSinceCreation: 265,
//     badges: 2,
//     memories: 8,
//     likes: 1.5,
//   },
// ];
// // 추가로 필요한 경우 더 많은 초기 데이터를 추가할 수 있습니다.

// const PublicCardList = ({ sortKey, keyword }) => {
//   const [groups, setGroups] = useState(initialGroups); // 초기 상태로 임시 데이터 사용
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);

//   useEffect(() => {
//     const loadGroups = async () => {
//       setLoading(true);
//       try {
//         const response = await fetchGroups({
//           isPublic: true,
//           sortBy: sortKey,
//           keyword,
//           page,
//           pageSize: 10,
//         });
//         setGroups((prevGroups) => [...prevGroups, ...response.data]);
//         setHasMore(response.currentPage < response.totalPages);
//       } catch (error) {
//         console.error("Failed to load groups:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadGroups();
//   }, [sortKey, keyword, page]);

//   const loadMore = () => {
//     if (hasMore && !loading) {
//       setPage((prevPage) => prevPage + 1);
//     }
//   };

//   return (
//     <>
//       {groups.length === 0 && !loading ? (
//         <div className="empty-state-container">
//           <NoGroupIcon className="no-group-icon" />
//           <div className="create-button-wrapper">
//             <CreateGroupButton className="empty-create-group-button" />
//           </div>
//         </div>
//       ) : (
//         <div className="group-list-container">
//           {groups.map((group) => (
//             <PublicCard key={group.id} group={group} />
//           ))}
//         </div>
//       )}
//       {hasMore && groups.length > 0 && (
//         <button
//           className="load-more-button"
//           onClick={loadMore}
//           disabled={loading}
//         >
//           {loading ? "로딩 중..." : "더보기"}
//         </button>
//       )}
//     </>
//   );
// };

// export default PublicCardList;
