import React, { useState } from "react";
import "./UploadMemory.css";
import axios from "axios";
import Header from "../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import xIcon from "../assets/icon=x.svg"; // x.svg 아이콘을 import
import UploadModal from "../components/UploadModal";

const UploadMemory = () => {
  const [nickname, setNickname] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postPassword, setPostPassword] = useState(""); // postPassword로 이름 변경
  const [imageFile, setImageFile] = useState(null); // 이미지 파일
  const [imageUrl, setImageUrl] = useState(""); // 업로드된 이미지 URL
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [location, setLocation] = useState("");
  const [moment, setMoment] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const { groupId } = useParams();

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
    setImageFile(event.target.files[0]);
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

  const handleModalSubmit = async (groupPassword) => {
    try {
      // 이미지 파일이 있으면 먼저 업로드
      const imageUrl = imageFile ? await uploadImage() : "";

      const requestBody = {
        nickname,
        title,
        content,
        postPassword, // 게시글 비밀번호
        groupPassword, // 그룹 비밀번호
        imageUrl, // 이미지 URL을 등록
        tags,
        location,
        moment,
        isPublic,
      };

      const response = await axios.post(
        `/api/groups/${groupId}/posts`,
        requestBody
      );

      if (response.status === 200) {
        alert("게시글이 성공적으로 등록되었습니다.");
        navigate(`/groups/${groupId}`);
      }
    } catch (error) {
      console.error("게시글 등록 중 오류 발생:", error);
      alert("게시글 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="upload-memory-page">
      <Header />
      <img
        src={xIcon}
        alt="close"
        className="close-button"
        onClick={() => navigate(-1)} // 이전 페이지로 돌아가도록 설정
      />
      <h1 className="page-title">추억 올리기</h1>
      <form className="memory-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-section">
          <div className="form-group">
            <label>닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력해 주세요"
              required
            />
          </div>

          <div className="form-group">
            <label>제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력해 주세요"
              required
            />
          </div>

          <div className="form-group">
            <label>이미지</label>
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
            <label>본문</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="본문 내용을 입력해 주세요"
              required
            />
          </div>
        </div>

        <div className="divider"></div>

        <div className="form-section">
          <div className="form-group">
            <label>태그</label>
            <input
              type="text"
              value={tagInput}
              onChange={handleTagChange}
              onKeyDown={handleTagKeyDown}
              placeholder="태그를 입력해 주세요"
              className="tags-input"
            />
            <div className="tags-list">
              {tags.map((tag, index) => (
                <div key={index} className="tag-item">
                  #{tag}{" "}
                  <img
                    src={xIcon}
                    alt="remove tag"
                    className="tag-remove"
                    onClick={() => handleRemoveTag(index)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>장소</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="장소를 입력해 주세요"
            />
          </div>

          <div className="form-group">
            <label>추억의 순간</label>
            <input
              type="date"
              value={moment}
              onChange={(e) => setMoment(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>그룹 공개 선택</label>
            <div className="switch-container">
              <span className="switch-label">
                {isPublic ? "공개" : "비공개"}
              </span>
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
              value={postPassword} // postPassword로 수정
              onChange={(e) => setPostPassword(e.target.value)}
              placeholder="추억 비밀번호를 생성해 주세요"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="submit-button"
          onClick={() => setIsModalOpen(true)}
        >
          올리기
        </button>
      </form>
      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default UploadMemory;

// api이전
// import React, { useState } from "react";
// import "./UploadMemory.css";
// import axios from "axios";
// import Header from "../components/Header";
// import { useNavigate, useParams } from "react-router-dom";
// import xIcon from "../assets/icon=x.svg"; // x.svg 아이콘을 import
// import UploadModal from "../components/UploadModal";

// const UploadMemory = () => {
//   const [nickname, setNickname] = useState("");
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [memoryPassword, setMemoryPassword] = useState("");
//   const [image, setImage] = useState("");
//   const [tags, setTags] = useState([]);
//   const [tagInput, setTagInput] = useState("");
//   const [location, setLocation] = useState("");
//   const [moment, setMoment] = useState("");
//   const [isPublic, setIsPublic] = useState(true);

//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const navigate = useNavigate();
//   const { groupId } = useParams();

//   const handleTagChange = (event) => {
//     setTagInput(event.target.value);
//   };

//   const handleTagKeyDown = (event) => {
//     if (event.key === "Enter" && tagInput.trim() !== "") {
//       event.preventDefault();
//       setTags([...tags, tagInput.trim()]);
//       setTagInput("");
//     }
//   };

//   const handleRemoveTag = (indexToRemove) => {
//     setTags(tags.filter((_, index) => index !== indexToRemove));
//   };

//   const handleImageChange = (event) => {
//     setImage(event.target.files[0]);
//   };

//   const handleModalSubmit = async (groupPassword) => {
//     const requestBody = {
//       nickname,
//       title,
//       content,
//       memoryPassword,
//       imageUrl: image ? URL.createObjectURL(image) : "",
//       tags,
//       location,
//       moment,
//       isPublic,
//       groupPassword,
//     };

//     try {
//       const response = await axios.post(
//         `/api/groups/${groupId}/posts`,
//         requestBody
//       );
//       if (response.status === 200) {
//         alert("게시글이 성공적으로 등록되었습니다.");
//         navigate(`/groups/${groupId}`);
//       }
//     } catch (error) {
//       console.error("게시글 등록 중 오류 발생:", error);
//       alert("게시글 등록 중 오류가 발생했습니다.");
//     }
//   };

//   return (
//     <div className="upload-memory-page">
//       <Header />
//       <img
//         src={xIcon}
//         alt="close"
//         className="close-button"
//         onClick={() => navigate(-1)} // 이전 페이지로 돌아가도록 설정
//       />
//       <h1 className="page-title">추억 올리기</h1>
//       <form className="memory-form" onSubmit={(e) => e.preventDefault()}>
//         <div className="form-section">
//           <div className="form-group">
//             <label>닉네임</label>
//             <input
//               type="text"
//               value={nickname}
//               onChange={(e) => setNickname(e.target.value)}
//               placeholder="닉네임을 입력해 주세요"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label>제목</label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="제목을 입력해 주세요"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label>이미지</label>
//             <div className="image-upload">
//               <input
//                 type="text"
//                 value={image ? image.name : "파일을 선택해 주세요"}
//                 readOnly
//                 className="file-input-display"
//               />
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="file-input"
//                 required
//               />
//               <button
//                 type="button"
//                 className="file-button"
//                 onClick={() =>
//                   document.querySelector('input[type="file"]').click()
//                 }
//               >
//                 파일 선택
//               </button>
//             </div>
//           </div>

//           <div className="form-group">
//             <label>본문</label>
//             <textarea
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               placeholder="본문 내용을 입력해 주세요"
//               required
//             />
//           </div>
//         </div>

//         <div className="divider"></div>

//         <div className="form-section">
//           <div className="form-group">
//             <label>태그</label>
//             <input
//               type="text"
//               value={tagInput}
//               onChange={handleTagChange}
//               onKeyDown={handleTagKeyDown}
//               placeholder="태그를 입력해 주세요"
//               className="tags-input"
//             />
//             <div className="tags-list">
//               {tags.map((tag, index) => (
//                 <div key={index} className="tag-item">
//                   #{tag}{" "}
//                   <img
//                     src={xIcon}
//                     alt="remove tag"
//                     className="tag-remove"
//                     onClick={() => handleRemoveTag(index)}
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="form-group">
//             <label>장소</label>
//             <input
//               type="text"
//               value={location}
//               onChange={(e) => setLocation(e.target.value)}
//               placeholder="장소를 입력해 주세요"
//             />
//           </div>

//           <div className="form-group">
//             <label>추억의 순간</label>
//             <input
//               type="date"
//               value={moment}
//               onChange={(e) => setMoment(e.target.value)}
//             />
//           </div>

//           <div className="form-group">
//             <label>그룹 공개 선택</label>
//             <div className="switch-container">
//               <span className="switch-label">
//                 {isPublic ? "공개" : "비공개"}
//               </span>
//               <label className="switch">
//                 <input
//                   type="checkbox"
//                   checked={isPublic}
//                   onChange={(e) => setIsPublic(e.target.checked)}
//                 />
//                 <span className="slider round"></span>
//               </label>
//             </div>
//           </div>

//           <div className="form-group">
//             <label>비밀번호 생성</label>
//             <input
//               type="password"
//               value={memoryPassword}
//               onChange={(e) => setMemoryPassword(e.target.value)}
//               placeholder="추억 비밀번호를 생성해 주세요"
//               required
//             />
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="submit-button"
//           onClick={() => setIsModalOpen(true)}
//         >
//           올리기
//         </button>
//       </form>
//       <UploadModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSubmit={handleModalSubmit}
//       />
//     </div>
//   );
// };

// export default UploadMemory;
