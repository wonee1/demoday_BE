import React from "react";
import "./PublicCard.css";
import { likeGroup } from "../api";
import { ReactComponent as LikeIcon } from "../assets/icon=flower.svg";
import { useNavigate } from "react-router-dom";

const PublicCard = ({ group, showBadges = true }) => {
  const navigate = useNavigate();

  const handleLike = async (event) => {
    event.stopPropagation();
    try {
      await likeGroup(group.id);
      alert("공감했습니다!");
    } catch (error) {
      console.error("Failed to like group:", error);
    }
  };

  const handleCardClick = () => {
    console.log("Navigating to group ID:", group.id); // groupId가 올바르게 전달되는지 로그 확인
    navigate(`/groups/${group.id}`); // 올바른 groupId 전달
  };

  return (
    <div className="card-container" onClick={handleCardClick}>
      {group.imageUrl && (
        <div className="card-image-container">
          <img
            src={group.imageUrl}
            alt={group.name}
            width="100%"
            height="auto"
          />
        </div>
      )}
      <div className="card-content">
        <div className="card-info">
          <span>D+{group.daysSinceCreation}</span>
          <span>| {group.isPublic ? "공개" : "비공개"}</span>
        </div>
        <h2 className="card-title">{group.name}</h2>
        <p className="card-description">{group.introduction}</p>
        <div className="card-footer">
          {showBadges && (
            <div className="footer-item">
              <span>획득 배지</span>
              <span>{group.badgeCount}</span>
            </div>
          )}
          <div className="footer-item">
            <span>추억</span>
            <span>{group.postCount}</span>
          </div>
          <div className="footer-item">
            <span>그룹 공감</span>
            <div className="like-container" onClick={handleLike}>
              <LikeIcon width="16px" height="16px" />
              <span>{group.likeCount}K</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicCard;
