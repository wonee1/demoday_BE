import React, { useState } from "react";
import "./CreateGroupPage.css"; // 페이지 스타일
import Header from "../components/Header";
import SuccessModal from "../components/SuccessModal"; // 성공 모달 컴포넌트
import ErrorModal from "../components/ErrorModal"; // 에러 모달 컴포넌트
import axios from "axios";

function CreateGroupPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [imageFile, setImageFile] = useState(null); // 이미지 파일 상태
  const [isPublic, setIsPublic] = useState(true);
  const [introduction, setIntroduction] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  // 이미지 업로드 API 호출
  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await axios.post("/api/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        return response.data.imageUrl; // 서버로부터 받은 imageUrl 반환
      } else {
        throw new Error("이미지 업로드에 실패했습니다.");
      }
    } catch (error) {
      console.error("이미지 업로드 오류:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 이미지 업로드 먼저 처리
      const imageUrl = imageFile ? await uploadImage() : "";

      const requestBody = {
        name,
        password,
        imageUrl, // 업로드된 이미지 URL 사용
        isPublic,
        introduction,
      };

      const response = await axios.post("/api/groups", requestBody);

      if (response.status === 201) {
        setShowSuccessModal(true);
      } else {
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("그룹 생성 중 에러 발생:", error);
      setShowErrorModal(true);
    }
  };

  const closeModal = () => {
    setShowSuccessModal(false);
    setShowErrorModal(false);
  };

  return (
    <div className="create-group-page">
      <div className="header-container">
        <Header />
      </div>
      <h1>그룹 만들기</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>그룹명</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>대표 이미지</label>
          <div className="image-upload">
            <input
              type="text"
              value={imageFile ? imageFile.name : "파일을 선택해 주세요"}
              readOnly
              className="file-input-display"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
              required
            />
            <button
              type="button"
              className="file-button"
              onClick={() =>
                document.querySelector('input[type="file"]').click()
              }
            >
              파일 선택
            </button>
          </div>
        </div>
        <div className="form-group">
          <label>그룹 소개</label>
          <textarea
            placeholder="그룹을 소개해 주세요"
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>그룹 공개 선택</label>
          <div className="switch-container">
            <span className="switch-label">{isPublic ? "공개" : "비공개"}</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>비밀번호 생성</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="그룹 비밀번호를 생성해 주세요"
            required
          />
        </div>
        <button type="submit" className="create-button">
          만들기
        </button>
      </form>

      {showSuccessModal && (
        <SuccessModal
          message="그룹이 성공적으로 등록되었습니다!"
          onClose={closeModal}
        />
      )}
      {showErrorModal && (
        <ErrorModal message="그룹 등록에 실패했습니다." onClose={closeModal} />
      )}
    </div>
  );
}

export default CreateGroupPage;
