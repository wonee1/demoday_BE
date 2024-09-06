import React, { useState, useEffect } from "react";
import axios from "axios";
import "./GroupEditModal.css";

const GroupEditModal = ({ isOpen, onClose, groupDetails, onSubmit }) => {
  const [formState, setFormState] = useState({
    name: "",
    image: "", // 초기 상태는 빈 문자열
    description: "",
    isPublic: true, // 기본값을 공개로 설정
    password: "",
  });
  const [imageFile, setImageFile] = useState(null); // 이미지 파일 저장

  useEffect(() => {
    if (groupDetails) {
      setFormState({
        name: groupDetails.name || "",
        image: groupDetails.image || "", // groupDetails의 image를 기본값으로 설정
        description: groupDetails.description || "",
        isPublic: groupDetails.isPublic || true,
        password: "",
      });
    }
  }, [groupDetails]);

  if (!isOpen) return null;

  // 이미지 파일 변경 시 처리
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file); // 이미지 파일을 state에 저장
  };

  // 이미지 업로드 함수
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
      }
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      throw new Error("이미지 업로드에 실패했습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formState.image;
      // 이미지 파일이 변경되었을 때만 업로드 처리
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const response = await axios.put(`/api/groups/${groupDetails.id}`, {
        name: formState.name,
        password: formState.password,
        imageUrl: imageUrl, // 새로운 이미지 URL로 업데이트
        isPublic: formState.isPublic,
        introduction: formState.description,
      });

      if (response.status === 200) {
        console.log("그룹 정보 수정 성공");
        onSubmit(response.data); // 수정 성공 후 콜백 실행
        onClose(); // 모달 닫기
      }
    } catch (error) {
      console.error(
        "그룹 정보 수정 실패:",
        error.response?.data?.message || error.message
      );

      if (error.response.status === 403) {
        alert("비밀번호가 틀렸습니다.");
      } else if (error.response.status === 400) {
        alert("잘못된 요청입니다.");
      } else if (error.response.status === 404) {
        alert("그룹이 존재하지 않습니다.");
      } else {
        alert("수정에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="groupedit-modal-overlay">
      <div className="groupedit-modal-content">
        <button className="groupedit-modal-close" onClick={onClose}>
          &times;
        </button>
        <h2>그룹 정보 수정</h2>
        <form onSubmit={handleSubmit}>
          <div className="edit-form-group">
            <label>그룹명</label>
            <input
              type="text"
              name="name"
              value={formState.name}
              onChange={(e) =>
                setFormState({ ...formState, name: e.target.value })
              }
              required
            />
          </div>
          <div className="edit-form-group">
            <label>대표 이미지</label>
            <div className="groupedit-image-upload">
              <input
                type="text"
                value={
                  imageFile
                    ? imageFile.name
                    : formState.image
                    ? "이미지 선택됨"
                    : "파일을 선택해 주세요"
                }
                readOnly
                className="groupedit-file-input-display"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="groupedit-file-input"
              />
              <button
                type="button"
                className="groupedit-file-button"
                onClick={() =>
                  document.querySelector(".groupedit-file-input").click()
                }
              >
                파일 선택
              </button>
            </div>
          </div>
          <div className="edit-form-group">
            <label>그룹 소개</label>
            <textarea
              name="description"
              value={formState.description}
              onChange={(e) =>
                setFormState({ ...formState, description: e.target.value })
              }
              placeholder="그룹을 소개해 주세요"
              required
            />
          </div>
          <div className="edit-form-group">
            <label>그룹 공개 선택</label>
            <div className="groupedit-switch-container">
              <span className="groupedit-switch-label">
                {formState.isPublic ? "공개" : "비공개"}
              </span>
              <label className="groupedit-switch">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formState.isPublic}
                  onChange={(e) =>
                    setFormState({ ...formState, isPublic: e.target.checked })
                  }
                />
                <span className="groupeidt-slider round"></span>
              </label>
            </div>
          </div>
          <div className="edit-form-group">
            <label>수정 권한 인증</label>
            <input
              type="password"
              name="password"
              value={formState.password}
              onChange={(e) =>
                setFormState({ ...formState, password: e.target.value })
              }
              placeholder="그룹 비밀번호를 입력해 주세요"
              required
            />
          </div>
          <button type="submit" className="groupedit-create-button">
            수정하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default GroupEditModal;
