const express = require('express');
const app = express();

const groupRoutes = require('./routes/groupRoutes');
const postRoutes = require('./routes/postRoutes');
const imageRoutes = require('./routes/imageRoutes');
const commentRoutes = require('./routes/commentRoutes');
app.use(express.json());

app.use('/api/groups', groupRoutes); // 그룹 관련 라우트 연결 
app.use('/api/groups', postRoutes); // 포스트 관련 라우트 연결
app.use('/api/posts', postRoutes); // '/api/posts' 경로에 연결
app.use('/api/posts', commentRoutes); // 댓글 관련 라우트 연결

// 정적 파일 서빙 (업로드된 이미지에 접근 가능하게 설정)
app.use('/uploads', express.static('uploads'));
app.use('/api/image', imageRoutes);//이미지 관련 라우트 연결 
app.use('/api/comments', commentRoutes); // 댓글 관련 라우트 연결
require('./cronJobs'); // cronJobs.js 파일 실행 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
