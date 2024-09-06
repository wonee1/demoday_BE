const express = require('express');
const router = express.Router();
const { createGroup, getGroups,updateGroup,deleteGroup, getGroupDetails,likeGroup,getGroupPublicStatus,verifyGroupPassword } = require('../controllers/groupController'); // 경로가 올바른지 확인

// POST /api/groups - 그룹 등록
router.post('/', createGroup);

// GET /api/groups - 그룹 목록 조회
router.get('/', getGroups);

// 그룹 수정
router.put('/:groupId', updateGroup);

//그룹 삭제 
router.delete('/:groupId', deleteGroup);

//그룹 상세 정보 조회
router.get('/:groupId', getGroupDetails);

//그룹 공감하기
router.post('/:groupId/like', likeGroup);

//그룹 공개 여부 확인
router.get('/:groupId/is-public', getGroupPublicStatus);

// POST /api/groups/:groupId/verify-password - 그룹 비밀번호 확인
router.post('/:groupId/verify-password', verifyGroupPassword);


module.exports = router;
