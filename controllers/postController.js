
// 그룹 생성
exports.createGroup = async (req, res) => {
    try {
        const { name, password, imageUrl, isPublic, introduction } = req.body;

        if (!name) {
            return res.status(400).json({ message: "그룹 이름은 필수입니다." });
        }

        const group = new Group({
            name,
            password,
            imageUrl,
            isPublic,
            introduction
        });

        await group.save();

        return res.status(201).json({
            id: group._id,
            name: group.name,
            imageUrl: group.imageUrl,
            isPublic: group.isPublic,
            likeCount: group.likeCount,
            badges: group.badges,
            postCount: group.postCount,
            createdAt: group.createdAt,
            introduction: group.introduction
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

        const filter = {};
        if (keyword) {
            filter.name = { $regex: keyword, $options: 'i' };
        }
        if (isPublic !== undefined) {
            filter.isPublic = isPublic === 'true';
        }

        let sortOption = {};
        switch (sortBy) {
            case 'mostPosted':
                sortOption.postCount = -1;
                break;
            case 'mostLiked':
                sortOption.likeCount = -1;
                break;
            case 'mostBadge':
                sortOption.badgeCount = -1;
                break;
            case 'latest':
            default:
                sortOption.createdAt = -1;
                break;
        }

        const totalItemCount = await Group.countDocuments(filter);
        const totalPages = Math.ceil(totalItemCount / pageSize);
        const groups = await Group.find(filter)
            .sort(sortOption)
            .skip((page - 1) * pageSize)
            .limit(parseInt(pageSize))
            .lean();

        const data = groups.map(group => ({
            id: group._id,
            name: group.name,
            imageUrl: group.imageUrl,
            isPublic: group.isPublic,
            likeCount: group.likeCount,
            badgeCount: group.badges.length,
            postCount: group.postCount,
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

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "그룹을 찾을 수 없습니다." });
        }

        if (group.password !== password) {
            return res.status(403).json({ message: "비밀번호가 일치하지 않습니다." });
        }

        group.name = name || group.name;
        group.imageUrl = imageUrl || group.imageUrl;
        group.isPublic = isPublic !== undefined ? isPublic : group.isPublic;
        group.introduction = introduction || group.introduction;

        await group.save();

        return res.status(200).json({
            id: group._id,
            name: group.name,
            imageUrl: group.imageUrl,
            isPublic: group.isPublic,
            likeCount: group.likeCount,
            badges: group.badges,
            postCount: group.postCount,
            createdAt: group.createdAt,
            introduction: group.introduction,
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
        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: '그룹을 찾을 수 없습니다.' });
        }

        if (group.password !== password) {
            return res.status(403).json({ message: '비밀번호가 일치하지 않습니다.' });
        }

        await Group.findByIdAndDelete(groupId);

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
        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: '그룹을 찾을 수 없습니다.' });
        }

        const postCount = await Post.countDocuments({ group: groupId });

        res.status(200).json({
            id: group._id,
            name: group.name,
            imageUrl: group.imageUrl,
            isPublic: group.isPublic,
            likeCount: group.likeCount,
            badges: group.badges,
            postCount: postCount,
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
        const group = await Group.findById(groupId);

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
        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: '그룹을 찾을 수 없습니다.' });
        }

        group.likeCount += 1;
        await group.save();

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
        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: '그룹을 찾을 수 없습니다.' });
        }

        res.status(200).json({ id: group._id, isPublic: group.isPublic });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};
