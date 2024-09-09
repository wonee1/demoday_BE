const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.get('/some-endpoint', async (req, res) => {
  // PrismaClient를 사용하여 데이터베이스 쿼리 수행
  const result = await prisma.someModel.findMany();
  res.json(result);
});
