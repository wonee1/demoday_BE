const express = require('express');
const router = express.Router();
const { uploadImage } = require('../controllers/imageController');

// POST /api/image - 이미지 업로드
router.post('/', uploadImage);

module.exports = router;
