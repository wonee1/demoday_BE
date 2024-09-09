import React, { useState, useEffect } from "react";
import axios from "axios"; // axios 추가
import "./MemoryEditModal.css";

const MemoryEditModal = ({ isOpen, onClose, onSubmit, postId, memoryDetails }) => {
  // 초기 상태 설정 시 memoryDetails가 undefined일 경우에도 빈 문자열로 처리
  const [nickname, setNickname] = useState(memoryDetails?.nickname || "");
  const [title, setTitle] = useState(memoryDetails?.title || "");
  const [content, setContent] = useState(memoryDetails?.content || "");
  const [memoryPassword, setMemoryPassword] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(memoryDetails?.imageUrl || "");
  const [tags, setTags] = useState(memoryDetails?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [location, setLocation] = useState(memoryDetails?.location || "");
  const [moment, setMoment] = useState(memoryDetails?.moment || "");
  const [isPublic, setIsPublic] = useState(memoryDetails?.isPublic || true);

  useEffect(() => {
    // memoryDetails가 변경되면 상태값을 다시 설정
    if (memoryDetails) {
      setNickname(memoryDetails.nickname || "");
      setTitle(memoryDetails.title || "");
      setContent(memoryDetails.content || "");
      setTags(memoryDetails.tags || []);
      setLocation(memoryDetails.location || "");
      setMoment(memoryDetails.moment || "");
      setIsPublic(memoryDetails.isPublic || true);
    }
  }, [memoryDetails]);

  const handleTagChange = (event) => {
    setTagInput(event.target.value);
  };

  const handleTagKeyDown = (event) => {
    if (event.key === "Enter" && tagInput.trim() !== "") {
      event.preventDefault();
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  // 이미지 업로드 함수
  const uploadImage = async () => {
    if (!image) return imageUrl; // 이미지가 없으면 기존 imageUrl 유지

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post("/api/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setImageUrl(response.data.imageUrl);
        return response.data.imageUrl;
      }
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      throw new Error("이미지 업로드에 실패했습니다.");
    }
  };

  const handleFormSubmit = async () => {
    try {
      // 이미지 업로드 후 URL 반환
      const updatedImageUrl = await uploadImage();

      // 수정할 게시글 데이터를 준비
      const updatedMemory = {
        nickname,
        title,
        content,
        postPassword: memoryPassword, // 게시글 비밀번호
        imageUrl: updatedImageUrl,
        tags,
        location,
        moment,
        isPublic,
      };

      // 서버에 게시글 수정 요청
      const response = await axios.put(
        `/api/posts/${postId}`, // postId를 직접 사용
        updatedMemory
      );

      if (response.status === 200) {
        alert("게시글이 성공적으로 수정되었습니다.");
        onSubmit(response.data); // 수정 후 콜백 함수 실행
        onClose(); // 모달 닫기
      }
    } catch (error) {
      console.error("게시글 수정 중 오류 발생:", error);
      alert("게시글 수정 중 오류가 발생했습니다.");
    }
  };

  if (!isOpen) return null; // 모달이 열리지 않았거나 데이터가 없을 때 렌더링하지 않음

  return (
    <div className="modal-overlay">
      <div className="modal-content-edit">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h1 className="edit-page-title">추억 수정</h1>
        <form className="edit-memory-form" onSubmit={(e) => e.preventDefault()}>
          <div className="edit-form-section">
            <div className="edit-form-group">
              <label className="edit-label">닉네임</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력해 주세요"
                required
              />
            </div>

            <div className="edit-form-group">
              <label className="edit-label">제목</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력해 주세요"
                required
              />
            </div>

            <div className="edit-form-group">
              <label className="edit-label">이미지</label>
              <div className="edit-image-upload">
                <input
                  type="text"
                  value={image ? image.name : memoryDetails?.imageUrl} // 옵셔널 체이닝
                  readOnly
                  className="edit-file-input-display"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="edit-file-input"
                />
                <button
                  type="button"
                  className="edit-file-button"
                  onClick={() =>
                    document.querySelector('input[type="file"]').click()
                  }
                >
                  파일 선택
                </button>
              </div>
            </div>

            <div className="edit-form-group">
              <label className="edit-label">본문</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="본문 내용을 입력해 주세요"
                required
              />
            </div>
          </div>

          <div className="edit-divider"></div>

          <div className="edit-form-section">
            <div className="edit-form-group">
              <label className="edit-label">태그</label>
              <input
                type="text"
                value={tagInput}
                onChange={handleTagChange}
                onKeyDown={handleTagKeyDown}
                placeholder="태그 입력 후 Enter"
                className="edit-tags-input"
              />
              <div className="edit-tags-list">
                {tags.map((tag, index) => (
                  <div key={index} className="edit-tag-item">
                    #{tag}{" "}
                    <button
                      className="edit-tag-remove"
                      onClick={() => handleRemoveTag(index)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="edit-form-group">
              <label className="edit-label">장소</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="장소를 입력해 주세요"
              />
            </div>

            <div className="edit-form-group">
              <label className="edit-label">추억의 순간</label>
              <input
                type="date"
                value={moment}
                onChange={(e) => setMoment(e.target.value)}
              />
            </div>

            <div className="edit-form-group">
              <label className="edit-label">공개 여부</label>
              <div className="edit-switch-container">
                <span className="edit-switch-label">
                  {isPublic ? "공개" : "비공개"}
                </span>
                <label className="edit-switch">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                  />
                  <span className="edit-slider round"></span>
                </label>
              </div>
            </div>

            <div className="edit-form-group">
              <label className="edit-label">수정 권한 인증</label>
              <input
                type="password"
                value={memoryPassword}
                onChange={(e) => setMemoryPassword(e.target.value)}
                placeholder="추억 비밀번호를 입력해 주세요"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="edit-submit-button"
            onClick={handleFormSubmit}
          >
            수정하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default MemoryEditModal;
