// cronJobs.js
const cron = require('node-cron');
const { checkBadgesForAllGroups } = require('../services/badgeService'); // badgeService 파일의 경로에 맞게 수정

// 매 10초마다 작업을 실행
cron.schedule('*/10 * * * * *', async () => {
    console.log('배지 확인 및 부여 작업 시작');
    try {
        await checkBadgesForAllGroups();
        console.log('배지 확인 및 부여 작업 완료');
        
    } catch (error) {
        console.error('배지 작업 중 에러 발생:', error);
    }
});
