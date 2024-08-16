// controllers/groupsController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 그룹 생성
const createGroup = async (req, res) => {
    const { name, password, imageUrl, isPublic, introduction } = req.body;

    // 요청 본문 유효성 검사
    if (!name || !imageUrl || typeof isPublic !== 'boolean' || !introduction) {
        return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    try {
        // 그룹 데이터 저장
        const newGroup = await prisma.group.create({
            data: {
                name,
                password, // password는 선택적 필드입니다.
                imageUrl,
                isPublic,
                introduction
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
        // 그룹 존재 여부 확인
        const group = await prisma.group.findUnique({
            where: { id: parseInt(groupId, 10) }
        });

        if (!group) {
            return res.status(404).json({ message: "존재하지 않습니다" });
        }

        // 비밀번호 확인 (비밀번호는 예시로 포함됨; 실제로는 비밀번호 확인 로직이 필요합니다)
        if (password !== 'expectedPassword') {
            return res.status(403).json({ message: "비밀번호가 틀렸습니다" });
        }

        // 그룹 정보 업데이트
        const updatedGroup = await prisma.group.update({
            where: { id: parseInt(groupId, 10) },
            data: {
                name,
                password, // 비밀번호는 선택적 필드이므로, 필요시 업데이트
                imageUrl,
                isPublic,
                introduction
            }
        });

        // 성공 응답 반환
        res.status(200).json(updatedGroup);
    } catch (error) {
        console.error('Error updating group:', error);
        res.status(500).json({ message: '서버 오류입니다' });
    }
};

module.exports = {
    createGroup,
    getGroups,
    updateGroup,
};



// 그룹 삭제
exports.deleteGroup = async (req, res) => {
    const { groupId } = req.params;
    const { password } = req.body;

    try {
        const group = await prisma.group.findUnique({ where: { id: parseInt(groupId) } });

        if (!group) {
            return res.status(404).json({ message: '그룹을 찾을 수 없습니다.' });
        }

        if (group.password !== password) {
            return res.status(403).json({ message: '비밀번호가 일치하지 않습니다.' });
        }

        await prisma.group.delete({ where: { id: parseInt(groupId) } });

        res.status(200).json({ message: '그룹이 삭제되었습니다.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// 그룹 상세 조회
exports.getGroupDetails = async (req, res) => {
    const { groupId } = req.params;

    try {
        const group = await prisma.group.findUnique({
            where: { id: parseInt(groupId) },
            include: {
                posts: true,
                badges: true,
            },
        });

        if (!group) {
            return res.status(404).json({ message: '그룹을 찾을 수 없습니다.' });
        }

        res.status(200).json({
            id: group.id,
            name: group.name,
            imageUrl: group.imageUrl,
            isPublic: group.isPublic,
            likeCount: group.likeCount,
            badges: group.badges || [],
            postCount: group.posts.length,
            createdAt: group.createdAt,
            introduction: group.introduction,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// 그룹 비밀번호 확인
exports.verifyGroupPassword = async (req, res) => {
    const { groupId } = req.params;
    const { password } = req.body;

    try {
        const group = await prisma.group.findUnique({ where: { id: parseInt(groupId) } });

        if (!group) {
            return res.status(404).json({ message: '그룹을 찾을 수 없습니다.' });
        }

        const isMatch = group.password === password;

        if (isMatch) {
            res.status(200).json({ message: '비밀번호가 확인되었습니다.' });
        } else {
            res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// 그룹 공감하기
exports.likeGroup = async (req, res) => {
    const { groupId } = req.params;

    try {
        const group = await prisma.group.findUnique({ where: { id: parseInt(groupId) } });

        if (!group) {
            return res.status(404).json({ message: '그룹을 찾을 수 없습니다.' });
        }

        const updatedGroup = await prisma.group.update({
            where: { id: parseInt(groupId) },
            data: {
                likeCount: { increment: 1 },
            },
        });

        res.status(200).json({ message: '그룹에 공감을 보냈습니다.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// 그룹 공개 여부 확인
exports.isGroupPublic = async (req, res) => {
    const { groupId } = req.params;

    try {
        const group = await prisma.group.findUnique({ where: { id: parseInt(groupId) } });

        if (!group) {
            return res.status(404).json({ message: '그룹을 찾을 수 없습니다.' });
        }

        res.status(200).json({ id: group.id, isPublic: group.isPublic });
    } catch (error) {
        console.error(error);
       
    }

}