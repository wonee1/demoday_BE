// controllers/groupsController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

// 그룹 생성
const createGroup = async (req, res) => {
    const { name, password, imageUrl, isPublic, introduction } = req.body;

    // 요청 본문 유효성 검사
    if (!name || !imageUrl || typeof isPublic !== 'boolean' || !introduction || !password) {
        return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    try {
        // 비밀번호 해싱
        console.log("Hashing password:", password);  // 디버깅 로그 추가
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed password:", hashedPassword);  // 디버깅 로그 추가

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

//그룹 목록 조회 
const getGroups = async (req, res) => {
    const { page = 1, pageSize = 10, sortBy = 'latest', keyword = '', isPublic = 'true' } = req.query;
    const pageNumber = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const pageSizeNumber = parseInt(pageSize, 10) > 0 ? parseInt(pageSize, 10) : 10;
    const isPublicBoolean = isPublic === 'true';

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

    if (!name || !imageUrl || typeof isPublic !== 'boolean' || !introduction) {
        return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    try {
        const group = await prisma.group.findUnique({
            where: { id: parseInt(groupId) },
        });

        if (!group) {
            return res.status(404).json({ message: "존재하지 않습니다" });
        }

        const isPasswordValid = await bcrypt.compare(password, group.password);
        console.log("Stored Password:", group.password);  // 디버깅 로그 추가
        console.log("Input Password:", password);         // 디버깅 로그 추가
        console.log("Password Valid:", isPasswordValid);  // 디버깅 로그 추가

        if (!isPasswordValid) {
            return res.status(403).json({ message: "비밀번호가 틀렸습니다" });
        }

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

//그룹 삭제 
const deleteGroup = async (req, res) => {
    const { groupId } = req.params;
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ message: '비밀번호를 제공해 주세요' });
    }

    try {
        const group = await prisma.group.findUnique({
            where: { id: parseInt(groupId) },
        });

        if (!group) {
            console.log("그룹을 찾을 수 없습니다.");
            return res.status(404).json({ message: "존재하지 않습니다" });
        }

        // 디버깅 로그
        console.log("Stored Password Hash:", group.password);  // 저장된 해시된 비밀번호 확인
        console.log("Input Password:", password);  // 입력된 비밀번호 확인

        // 비밀번호 비교
        const isPasswordValid = await bcrypt.compare(password, group.password);

        // 비교 결과 확인
        if (!isPasswordValid) {
            console.log("비밀번호가 일치하지 않습니다.");
            console.log("비교된 비밀번호:", password);
            console.log("저장된 해시 비밀번호:", group.password);
            return res.status(403).json({ message: "비밀번호가 틀렸습니다" });
        }

        // 그룹 삭제
        await prisma.group.delete({
            where: { id: parseInt(groupId) },
        });

        console.log("그룹 삭제 성공");
        res.status(200).json({ message: "그룹 삭제 성공" });
    } catch (error) {
        console.error('Error deleting group:', error);
        res.status(500).json({ message: '서버 오류입니다' });
    }
};


// 그룹 상세 정보 조회
const getGroupDetails = async (req, res) => {
    const { groupId } = req.params;

    if (!groupId || isNaN(groupId)) {
        return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    try {
        const group = await prisma.group.findUnique({
            where: { id: parseInt(groupId) },
            include: {
                badges: true,
                posts: true,
            }
        });

        if (!group) {
            return res.status(404).json({ message: "존재하지 않습니다" });
        }


        const groupDetails = {
            id: group.id,
            name: group.name,
            imageUrl: group.imageUrl,
            isPublic: group.isPublic,
            likeCount: group.likeCount,
            badges: group.badges.map(badge => badge.badge_type),  // badge_type 필드를 반환
            postCount: group.posts.length,
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

    if (!groupId || isNaN(groupId)) {
        return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    try {
        const group = await prisma.group.findUnique({
            where: { id: parseInt(groupId) },
        });

        if (!group) {
            return res.status(404).json({ message: "존재하지 않습니다" });
        }

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

// 그룹 공개 여부 확인
const getGroupPublicStatus = async (req, res) => {
    const { groupId } = req.params;

    if (!groupId || isNaN(groupId)) {
        return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    try {
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

        res.status(200).json(group);
    } catch (error) {
        console.error('Error getting group public status:', error);
        res.status(500).json({ message: '서버 오류입니다' });
    }
};

//그룹 조회 권한 확인
const verifyGroupPassword = async (req, res) => {
    const { groupId } = req.params;
    const { password } = req.body;

    // 요청 본문 유효성 검사
    if (!password) {
        return res.status(400).json({ message: '비밀번호를 제공해 주세요' });
    }

    try {
        // 그룹 존재 확인
        const group = await prisma.group.findUnique({
            where: { id: parseInt(groupId) },
        });

        if (!group) {
            return res.status(404).json({ message: '존재하지 않습니다' });
        }

        // 비밀번호 검증
        const isPasswordValid = await bcrypt.compare(password, group.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: '비밀번호가 틀렸습니다' });
        }

        res.status(200).json({ message: '비밀번호가 확인되었습니다' });
    } catch (error) {
        console.error('Error verifying group password:', error);
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
    verifyGroupPassword,
};