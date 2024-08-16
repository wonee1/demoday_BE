const express = require('express');
const app = express();

const groupRoutes = require('./routes/groupRoutes');

// 다른 미들웨어와 라우트 설정

app.use('/api/groups', groupRoutes);

// 서버 실행 코드
