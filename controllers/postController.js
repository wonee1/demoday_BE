const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

const createPost = async (req, res) => {
    const { groupId } = req.params;
    const {
        nickname,
        title,
        content,
        postPassword,
        groupPassword,
        imageUrl,
        tags,
        location,
        moment,
        isPublic
    } = req.body;

    // 요청 본문 유효성 검사
    if (!nickname || !title || !content || !postPassword || !groupPassword || !imageUrl || !moment) {
        return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    try {
        // 그룹 존재 확인 및 비밀번호 검증
        const group = await prisma.group.findUnique({
            where: { id: parseInt(groupId) },
        });

        if (!group) {
            return res.status(404).json({ message: "그룹이 존재하지 않습니다" });
        }

        const isGroupPasswordValid = await bcrypt.compare(groupPassword, group.password);

        if (!isGroupPasswordValid) {
            return res.status(403).json({ message: "그룹 비밀번호가 틀렸습니다" });
        }

        // 게시글 비밀번호 해싱
        const hashedPostPassword = await bcrypt.hash(postPassword, 10);

        // 게시글 생성
        const newPost = await prisma.post.create({
            data: {
                groupId: parseInt(groupId),
                nickname,
                title,
                content,
                password: hashedPostPassword,
                imageUrl,
                tags: tags,  // 배열로 저장
                location,
                moment: new Date(moment),  // 문자열 날짜를 Date 객체로 변환
                isPublic,
                likeCount: 0,
                commentCount: 0,
            }
        });

        // 성공적으로 생성된 게시글 반환
        res.status(200).json(newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: '서버 오류입니다' });
    }
};

module.exports = {
    createPost,
};
