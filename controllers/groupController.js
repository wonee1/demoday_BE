// controllers/groupsController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

// 그룹 생성
const createGroup = async (req, res) => {
    const { name, password, imageUrl, isPublic, introduction } = req.body;

    // 요청 본문 유효성 검사
    if (!name || !imageUrl || typeof isPublic !== 'boolean' || !introduction) {
        return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    try {
        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);

        // 그룹 데이터 저장
        const newGroup = await prisma.group.create({
            data: {
                name,
                password: hashedPassword,
                imageUrl,
                isPublic,
                introduction,
            }
        });

        // 성공 응답 반환
        res.status(201).json(newGroup);
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ message: '서버 오류입니다' });
    }
};

const getGroups = async (req, res) => {
    // 쿼리 파라미터로부터 값 추출
    const { page = 1, pageSize = 10, sortBy = 'latest', keyword = '', isPublic = 'true' } = req.query;

    // 쿼리 파라미터 값의 유효성 검사
    const pageNumber = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const pageSizeNumber = parseInt(pageSize, 10) > 0 ? parseInt(pageSize, 10) : 10;
    const isPublicBoolean = isPublic === 'true'; // 쿼리 파라미터에서 'true' 또는 'false'로 전달됨

    // 정렬 기준 설정
    let orderBy;
    switch (sortBy) {
        case 'mostPosted':
            orderBy = { postCount: 'desc' };
            break;
        case 'mostLiked':
            orderBy = { likeCount: 'desc' };
            break;
        case 'mostBadge':
            orderBy = { badgeCount: 'desc' };
            break;
        case 'latest':
        default:
            orderBy = { createdAt: 'desc' };
            break;
    }

    try {
        // 그룹 데이터 조회
        const [totalItemCount, data] = await Promise.all([
            prisma.group.count({
                where: {
                    isPublic: isPublicBoolean,
                    name: {
                        contains: keyword,
                        mode: 'insensitive'
                    }
                }
            }),
            prisma.group.findMany({
                where: {
                    isPublic: isPublicBoolean,
                    name: {
                        contains: keyword,
                        mode: 'insensitive'
                    }
                },
                orderBy,
                skip: (pageNumber - 1) * pageSizeNumber,
                take: pageSizeNumber
            })
        ]);

        // 응답 반환
        const totalPages = Math.ceil(totalItemCount / pageSizeNumber);
        res.json({
            currentPage: pageNumber,
            totalPages,
            totalItemCount,
            data
        });
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ message: '서버 오류입니다' });
    }
};

// 그룹 수정
const updateGroup = async (req, res) => {
    const { groupId } = req.params;
    const { name, password, imageUrl, isPublic, introduction } = req.body;

    // 요청 본문 유효성 검사
    if (!name || !imageUrl || typeof isPublic !== 'boolean' || !introduction) {
        return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    try {
        // 그룹 정보 조회
        const group = await prisma.group.findUnique({
            where: { id: parseInt(groupId) },
        });

        if (!group) {
            return res.status(404).json({ message: "존재하지 않습니다" });
        }

        // 비밀번호 확인
        const isPasswordValid = await bcrypt.compare(password, group.password);
        if (!isPasswordValid) {
            return res.status(403).json({ message: "비밀번호가 틀렸습니다" });
        }

        // 그룹 정보 업데이트
        const updatedGroup = await prisma.group.update({
            where: { id: parseInt(groupId) },
            data: {
                name,
                imageUrl,
                isPublic,
                introduction
            }
        });

        res.status(200).json(updatedGroup);
    } catch (error) {
        console.error('Error updating group:', error);
        res.status(500).json({ message: '서버 오류입니다' });
    }
};

//그룹 삭제하기 
const deleteGroup = async (req, res) => {
    const { groupId } = req.params;
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    try {
        // 그룹 정보 조회
        const group = await prisma.group.findUnique({
            where: { id: parseInt(groupId) },
        });

        if (!group) {
            console.log("그룹을 찾을 수 없습니다."); // 그룹이 없을 경우 로그
            return res.status(404).json({ message: "존재하지 않습니다" });
        }

        // 비밀번호 확인
        const isPasswordValid = await bcrypt.compare(password, group.password);
        console.log("비밀번호 확인 결과:", isPasswordValid); // 비밀번호 비교 결과 로그

        if (!isPasswordValid) {
            return res.status(403).json({ message: "비밀번호가 틀렸습니다" });
        }

        // 그룹 삭제
        await prisma.group.delete({
            where: { id: parseInt(groupId) },
        });

        console.log("그룹 삭제 성공"); // 삭제 성공 로그
        res.status(200).json({ message: "그룹 삭제 성공" });
    } catch (error) {
        console.error('Error deleting group:', error);
        res.status(500).json({ message: '서버 오류입니다' });
    }
};


//그룹 상세 정보 조회 
const getGroupDetails = async (req, res) => {
    const { groupId } = req.params;

    // 그룹 ID가 유효한지 확인
    if (!groupId || isNaN(groupId)) {
        return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    try {
        // 그룹 정보 조회
        const group = await prisma.group.findUnique({
            where: { id: parseInt(groupId) },
            include: {
                badges: true, // 관련된 뱃지들 포함
                posts: true,  // 관련된 포스트들 포함
            }
        });

        if (!group) {
            return res.status(404).json({ message: "존재하지 않습니다" });
        }

        // 필요한 데이터만 추출
        const groupDetails = {
            id: group.id,
            name: group.name,
            imageUrl: group.imageUrl,
            isPublic: group.isPublic,
            likeCount: group.likeCount,
            badges: group.badges.map(badge => badge.name), // 뱃지 이름 목록만 추출
            postCount: group.posts.length, // 포스트 개수
            createdAt: group.createdAt,
            introduction: group.introduction,
        };

        res.status(200).json(groupDetails);
    } catch (error) {
        console.error('Error fetching group details:', error);
        res.status(500).json({ message: '서버 오류입니다' });
    }
};


// 그룹 공감하기
const likeGroup = async (req, res) => {
    const { groupId } = req.params;

    // 그룹 ID가 유효한지 확인
    if (!groupId || isNaN(groupId)) {
        return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    try {
        // 그룹 존재 확인
        const group = await prisma.group.findUnique({
            where: { id: parseInt(groupId) },
        });

        if (!group) {
            return res.status(404).json({ message: "존재하지 않습니다" });
        }

        // likeCount 증가
        await prisma.group.update({
            where: { id: parseInt(groupId) },
            data: {
                likeCount: group.likeCount + 1,
            },
        });

        res.status(200).json({ message: "그룹 공감하기 성공" });
    } catch (error) {
        console.error('Error liking group:', error);
        res.status(500).json({ message: '서버 오류입니다' });
    }
};


//그룹 공개여부 확인 
const getGroupPublicStatus = async (req, res) => {
    const { groupId } = req.params;

    // 그룹 ID가 유효한지 확인
    if (!groupId || isNaN(groupId)) {
        return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    try {
        // 그룹 존재 확인
        const group = await prisma.group.findUnique({
            where: { id: parseInt(groupId) },
            select: {
                id: true,
                isPublic: true,
            },
        });

        if (!group) {
            return res.status(404).json({ message: "존재하지 않습니다" });
        }

        // 공개 여부 반환
        res.status(200).json(group);
    } catch (error) {
        console.error('Error getting group public status:', error);
        res.status(500).json({ message: '서버 오류입니다' });
    }
};

module.exports = {
    createGroup,
    getGroups,
    updateGroup,
    deleteGroup,
    getGroupDetails,
    likeGroup,
    getGroupPublicStatus,
};
