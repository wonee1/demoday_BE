const express = require('express');
const app = express();
const groupRoutes = require('./routes/groupRoutes'); // 경로가 올바른지 확인

app.use(express.json()); // JSON 본문을 파싱하는 미들웨어
app.use('/api/groups', groupRoutes); // '/api/groups' 경로에 그룹 라우터를 연결

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
