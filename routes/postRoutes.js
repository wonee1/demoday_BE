const express = require('express');
const router = express.Router();
const { createPost } = require('../controllers/postController');

// POST /api/groups/:groupId/posts - 게시글 등록
router.post('/:groupId/posts', createPost);

module.exports = router;
