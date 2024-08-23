const multer = require('multer');
const path = require('path');

// 파일 저장 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // 이미지를 저장할 폴더
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // 파일 이름 설정
    }
});

const upload = multer({ storage: storage }).single('image'); // 'image'는 폼 데이터의 필드 이름

const uploadImage = (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            return res.status(500).json({ message: '이미지 업로드 실패', error: err.message });
        }

        // 파일이 제대로 업로드되었는지 확인
        if (!req.file) {
            return res.status(400).json({ message: '이미지가 업로드되지 않았습니다' });
        }

        // 이미지 URL 생성 (예: 서버의 도메인 + 이미지 경로)
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        res.status(200).json({ imageUrl: imageUrl });
    });
};

module.exports = {
    uploadImage,
};
