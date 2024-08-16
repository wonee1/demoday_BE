// controllers/groupsController.js
const prisma = require('../prisma/client');

// 그룹 생성
exports.createGroup = async (req, res) => {
    try {
        const { name, password, imageUrl, isPublic, introduction } = req.body;

        if (!name) {
            return res.status(400).json({ message: "그룹 이름은 필수입니다." });
        }

        const group = await prisma.group.create({
            data: {
                name,
                password,
                imageUrl,
                isPublic,
                introduction,
            },
        });

        return res.status(201).json({
            id: group.id,
            name: group.name,
            imageUrl: group.imageUrl,
            isPublic: group.isPublic,
            likeCount: group.likeCount,
            badges: [], // badges를 Prisma에서 따로 관리할 경우 필요합니다.
            postCount: 0, // 새로운 그룹이므로 postCount는 0
            createdAt: group.createdAt,
            introduction: group.introduction,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "서버 오류입니다." });
    }
};

// 그룹 목록 조회
exports.getGroups = async (req, res) => {
    try {
        const { page = 1, pageSize = 10, sortBy = 'latest', keyword = '', isPublic } = req.query;

        const filter = {
            where: {},
        };
        if (keyword) {
            filter.where.name = { contains: keyword, mode: 'insensitive' };
        }
        if (isPublic !== undefined) {
            filter.where.isPublic = isPublic === 'true';
        }

        let orderBy = {};
        switch (sortBy) {
            case 'mostPosted':
                orderBy.postCount = 'desc';
                break;
            case 'mostLiked':
                orderBy.likeCount = 'desc';
                break;
            case 'mostBadge':
                orderBy.badgeCount = 'desc';
                break;
            case 'latest':
            default:
                orderBy.createdAt = 'desc';
                break;
        }

        const totalItemCount = await prisma.group.count(filter);
        const totalPages = Math.ceil(totalItemCount / pageSize);
        const groups = await prisma.group.findMany({
            ...filter,
            orderBy,
            skip: (page - 1) * pageSize,
            take: parseInt(pageSize),
        });

        const data = groups.map(group => ({
            id: group.id,
            name: group.name,
            imageUrl: group.imageUrl,
            isPublic: group.isPublic,
            likeCount: group.likeCount,
            badgeCount: group.badges?.length || 0,
            postCount: group.posts?.length || 0,
            createdAt: group.createdAt,
            introduction: group.introduction,
        }));

        return res.status(200).json({
            currentPage: parseInt(page),
            totalPages,
            totalItemCount,
            data,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "서버 오류입니다." });
    }
};

// 그룹 정보 수정
exports.updateGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { name, password, imageUrl, isPublic, introduction } = req.body;

        const group = await prisma.group.findUnique({ where: { id: parseInt(groupId) } });
        if (!group) {
            return res.status(404).json({ message: "그룹을 찾을 수 없습니다." });
        }

        if (group.password !== password) {
            return res.status(403).json({ message: "비밀번호가 일치하지 않습니다." });
        }

        const updatedGroup = await prisma.group.update({
            where: { id: parseInt(groupId) },
            data: {
                name: name || group.name,
                imageUrl: imageUrl || group.imageUrl,
                isPublic: isPublic !== undefined ? isPublic : group.isPublic,
                introduction: introduction || group.introduction,
            },
        });

        return res.status(200).json({
            id: updatedGroup.id,
            name: updatedGroup.name,
            imageUrl: updatedGroup.imageUrl,
            isPublic: updatedGroup.isPublic,
            likeCount: updatedGroup.likeCount,
            badges: updatedGroup.badges || [],
            postCount: updatedGroup.posts?.length || 0,
            createdAt: updatedGroup.createdAt,
            introduction: updatedGroup.introduction,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ message: "잘못된 요청입니다." });
    }
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