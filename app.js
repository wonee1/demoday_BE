const express = require('express');
const app = express();

const groupRoutes = require('./routes/groupRoutes');
const postRoutes = require('./routes/postRoutes');

app.use(express.json());

app.use('/api/groups', groupRoutes);
app.use('/api/groups', postRoutes);
app.use('/api/posts', postRoutes); // '/api/posts' 경로에 연결


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
