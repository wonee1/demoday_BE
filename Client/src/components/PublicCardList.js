import React, { useState, useEffect } from "react";
import "./PublicCardList.css";
import PublicCard from "./PublicCard";
import { fetchGroups } from "../api"; // API 호출 함수 임포트
import { ReactComponent as NoGroupIcon } from "../assets/type=group.svg";
import CreateGroupButton from "../components/CreateGroupButton";

const PublicCardList = ({ sortKey, keyword }) => {
  const [groups, setGroups] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // 그룹 목록 불러오는 함수
  const loadGroups = async (reset = false) => {
    setLoading(true);
    try {
      console.log("Fetching groups with sortKey:", sortKey); // 디버깅용 로그 추가
      const response = await fetchGroups({
        isPublic: true,
        sortBy: sortKey, // 선택한 정렬 기준을 API 요청에 포함
        keyword,
        page: reset ? 1 : page,
        pageSize: 10,
      });
      if (reset) {
        setGroups(response.data); // 새 정렬 기준일 경우 목록을 초기화
      } else {
        setGroups((prevGroups) => [...prevGroups, ...response.data]);
      }
      setHasMore(response.currentPage < response.totalPages);
    } catch (error) {
      console.error("Failed to load groups:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups(true); // sortKey나 keyword가 변경되면 목록을 초기화
  }, [sortKey, keyword]);

  useEffect(() => {
    if (page > 1) loadGroups(); // 페이지 변경 시 추가로 그룹 불러오기
  }, [page]);

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
