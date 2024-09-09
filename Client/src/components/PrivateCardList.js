import React, { useState, useEffect } from "react";
import PublicCard from "./PublicCard";
import { fetchPrivateGroups } from "../api"; // 비공개 그룹 데이터를 가져오는 API 함수
import { ReactComponent as NoGroupIcon } from "../assets/type=group.svg";
import { useNavigate } from "react-router-dom";
import "./PublicCardList.css";

const PrivateGroupList = ({ sortKey, keyword }) => {
  // sortKey를 인자로 받음
  const [groups, setGroups] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const loadGroups = async () => {
      setLoading(true);
      try {
        const response = await fetchPrivateGroups({
          sortBy: sortKey, // 정렬 기준을 API 호출에 포함
          keyword,
          page,
          pageSize: 10,
        });
        setGroups((prevGroups) => [...prevGroups, ...response.data]);
        setHasMore(response.currentPage < response.totalPages);
      } catch (error) {
        console.error("Failed to load private groups:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, [sortKey, keyword, page]); // sortKey가 변경될 때마다 API 호출

  const loadMore = () => {
    if (!hasMore || loading) return;
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <>
      {groups.length === 0 && !loading ? (
        <div className="empty-state-container">
          <NoGroupIcon className="no-group-icon" />
          <p>비공개 그룹이 없습니다.</p>
        </div>
      ) : (
        <div className="group-list-container">
          {groups.map((group) => (
            <PublicCard
              key={group.id}
              group={group}
              showBadges={false}
              onClick={() => navigate(`/groups/private/${group.id}`)}
            />
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

export default PrivateGroupList;