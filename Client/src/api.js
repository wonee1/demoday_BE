import axios from "axios";

// 그룹 목록 조회 API
export async function fetchGroups({
  isPublic,
  sortBy,
  keyword,
  page,
  pageSize,
}) {
  const queryParams = new URLSearchParams();

  if (isPublic !== undefined) queryParams.append("isPublic", isPublic);
  if (sortBy) queryParams.append("sortBy", sortBy);
  if (keyword) queryParams.append("keyword", keyword);
  queryParams.append("page", page);
  queryParams.append("pageSize", pageSize);

  const response = await fetch(`/api/groups?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch groups: ${response.status}`);
  }
  return await response.json();
}

// 비공개 그룹 조회 API
export async function fetchPrivateGroups({ sortBy, keyword, page, pageSize }) {
  const queryParams = new URLSearchParams({
    isPublic: false, // 비공개 그룹
  });

  if (sortBy) queryParams.append("sortBy", sortBy);
  if (keyword) queryParams.append("keyword", keyword);
  queryParams.append("page", page);
  queryParams.append("pageSize", pageSize);

  const response = await fetch(`/api/groups?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch private groups: ${response.status}`);
  }
  return await response.json();
}

// 그룹 상세 조회 API
export async function fetchGroupDetails(groupId) {
  const response = await fetch(`/api/groups/${groupId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch group details: ${response.status}`);
  }
  return await response.json();
}

// 그룹 공감하기 API
export async function likeGroup(groupId) {
  const response = await fetch(`/api/groups/${groupId}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to like group: ${response.status}`);
  }
  return await response.json();
}

// 그룹 비밀번호 확인 API
export async function verifyGroupPassword(groupId, password) {
  const response = await fetch(`/api/groups/${groupId}/verify-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });
  if (!response.ok) {
    throw new Error(`Password verification failed: ${response.status}`);
  }
  return await response.json();
}

// 그룹 카드 조회 API
export async function fetchGroupCards(groupId) {
  const response = await fetch(`/api/groups/${groupId}/cards`);
  if (!response.ok) {
    throw new Error(`Failed to fetch group cards: ${response.status}`);
  }
  return await response.json();
}

// 게시글 목록 조회 API
export async function fetchPosts({
  groupId,
  page,
  pageSize,
  sortBy,
  keyword,
  isPublic,
}) {
  const queryParams = new URLSearchParams();

  if (sortBy) queryParams.append("sortBy", sortBy);
  if (keyword) queryParams.append("keyword", keyword);
  queryParams.append("page", page);
  queryParams.append("pageSize", pageSize);
  queryParams.append("isPublic", isPublic);

  const response = await fetch(
    `/api/groups/${groupId}/posts?${queryParams.toString()}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.status}`);
  }
  return await response.json();
}

// 게시글 상세 조회 API
export async function fetchPostDetails(postId) {
  const response = await fetch(`/api/posts/${postId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch post details: ${response.status}`);
  }
  return await response.json();
}

// 게시글 등록 API
export async function createPost(groupId, postData) {
  const response = await axios.post(`/api/groups/${groupId}/posts`, postData);
  return response.data;
}

// 게시글 수정 API
export async function updatePost(postId, postData) {
  const response = await axios.put(`/api/posts/${postId}`, postData);
  return response.data;
}

// 게시글 삭제 API
export async function deletePost(postId, password) {
  const response = await axios.delete(`/api/posts/${postId}`, {
    data: { password },
  });
  return response.data;
}

// 댓글 목록 조회 API
export async function fetchComments(postId, page, pageSize) {
  const queryParams = new URLSearchParams({
    page,
    pageSize,
  });

  const response = await fetch(
    `/api/posts/${postId}/comments?${queryParams.toString()}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch comments: ${response.status}`);
  }
  return await response.json();
}

// 댓글 등록 API
export async function createComment(postId, commentData) {
  const response = await axios.post(
    `/api/posts/${postId}/comments`,
    commentData
  );
  return response.data;
}

// 댓글 수정 API
export async function updateComment(commentId, commentData) {
  const response = await axios.put(`/api/comments/${commentId}`, commentData);
  return response.data;
}

// 댓글 삭제 API
export async function deleteComment(commentId, password) {
  const response = await axios.delete(`/api/comments/${commentId}`, {
    data: { password },
  });
  return response.data;
}

// 이미지 업로드 API
export async function uploadImage(imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await axios.post("/api/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.imageUrl;
}

