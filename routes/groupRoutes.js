const express = require('express');
const router = express.Router();
const { createGroup, getGroups,updateGroup } = require('../controllers/groupController'); // 경로가 올바른지 확인

// POST /api/groups - 그룹 등록
router.post('/', createGroup);

// GET /api/groups - 그룹 목록 조회
router.get('/', getGroups);

// 그룹 수정
router.put('/:groupId', updateGroup);

module.exports = router;
