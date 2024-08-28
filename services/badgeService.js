// services/badgeService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const awardBadge = async (groupId, badgeType) => {
    const existingBadge = await prisma.badge.findFirst({
        where: {
            groupId: parseInt(groupId),  // groupId를 정수로 변환
            badge_type: badgeType,       // badgeType 대신 badge_type 사용
        },
    });

    if (!existingBadge) {
        await prisma.badge.create({
            data: {
                groupId: parseInt(groupId),  // groupId를 정수로 변환
                badge_type: badgeType,       // badgeType 대신 badge_type 사용
            },
        });

        // 배지가 부여되었다는 것을 로그로 남기거나 사용자에게 알림 전송
        console.log(`그룹 ID ${groupId}에 '${badgeType}' 배지가 부여되었습니다.`);
    }
};

// 7일 연속 추억 등록 배지 확인
const check7DaysBadge = async (groupId) => {
    const posts = await prisma.post.findMany({
        where: {
            groupId: parseInt(groupId),  // 그룹 ID를 숫자로 변환
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    let consecutiveDays = 1;

    for (let i = 0; i < posts.length - 1; i++) {
        const currentDate = new Date(posts[i].createdAt);
        const nextDate = new Date(posts[i + 1].createdAt);

        // 두 날짜가 1일 차이인지 확인 (UTC 기준)
        const diffDays = (currentDate.getUTCFullYear() - nextDate.getUTCFullYear()) * 365 
                         + (currentDate.getUTCMonth() - nextDate.getUTCMonth()) * 30 
                         + (currentDate.getUTCDate() - nextDate.getUTCDate());

        if (diffDays === 1) {
            consecutiveDays++;
        } else {
            consecutiveDays = 1;
        }

        if (consecutiveDays >= 7) {
            await awardBadge(groupId, '7일 연속 추억 등록');
            break;
        }
    }
};

// 추억 수 20개 이상 등록 배지 확인
const check20PostsBadge = async (groupId) => {
    const postCount = await prisma.post.count({
        where: {
            groupId: parseInt(groupId),  // 그룹 ID를 숫자로 변환
        }
    });

    if (postCount >= 20) {
        await awardBadge(groupId, '추억 수 20개 이상 등록');
    }
};


// 그룹 생성 후 1년 달성 배지 확인
const checkOneYearBadge = async (groupId) => {
    const group = await prisma.group.findUnique({
        where: { id: parseInt(groupId) },  // 그룹 ID를 숫자로 변환
        
    });

    const oneYear = 1000 * 60 * 60 * 24 * 365;
    if (new Date() - new Date(group.createdAt) >= oneYear) {
        await awardBadge(groupId, '그룹 생성 후 1년 달성');
    }
};


// 그룹 공간 1만 개 이상 받기 배지 확인
const checkSpaceBadge = async (groupId) => {
    const group = await prisma.group.findUnique({
        where: { id: parseInt(groupId) },  // 그룹 ID를 숫자로 변환
        include: {
            badges: {
                select: {
                    badge_type: true,  // badge_type 필드를 명시적으로 선택
                },
            },
            posts: true,
        }
    });

    if (group.likeCount >= 10000) {
        await awardBadge(groupId, '그룹 공간 1만 개 이상 받기');
    }
};

// 추억 공감 1만 개 이상 받기 배지 확인
const checkLikeBadge = async (groupId) => {
    const postWith10kLikes = await prisma.post.findFirst({
        where: { 
            groupId: parseInt(groupId),  // 그룹 ID를 숫자로 변환
            likeCount: { gte: 10000 }
        },
    });

    if (postWith10kLikes) {
        await awardBadge(groupId, '추억 공감 1만 개 이상 받기');
    }
};

// 모든 그룹에 대한 배지 확인
const checkBadgesForAllGroups = async () => {
    const groups = await prisma.group.findMany();

    for (const group of groups) {
        await check7DaysBadge(group.id);
        await check20PostsBadge(group.id);
        await checkOneYearBadge(group.id);
        await checkSpaceBadge(group.id);
        await checkLikeBadge(group.id);
    }
};


module.exports = {
    check7DaysBadge,
    check20PostsBadge,
    checkOneYearBadge,
    checkSpaceBadge,
    checkLikeBadge,
    checkBadgesForAllGroups
};
