const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');


//댓글 등록 
const createComment = async (req, res) => {
    const { postId } = req.params;
    const { nickname, content, password } = req.body;

    // 로그 추가
    console.log('Request Body:', req.body);

    // 요청 본문 유효성 검사
    if (!nickname || !content || !password) {
        return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    try {
        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);

        // 댓글 저장
        const newComment = await prisma.comment.create({
            data: {
                postId: parseInt(postId),
                nickname,
                content,
                password: hashedPassword,
            },
        });

        res.status(200).json({
            id: newComment.id,
            nickname: newComment.nickname,
            content: newComment.content,
            createdAt: newComment.createdAt,
        });
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ message: '서버 오류입니다' });
    }
};

//댓글 목록 조회 
const getComments = async (req, res) => {
    const { postId } = req.params;
    const { page = 1, pageSize = 10 } = req.query;

    // 페이지 번호와 페이지 크기 값 유효성 검사
    const pageNumber = parseInt(page, 10);
    const pageSizeNumber = parseInt(pageSize, 10);

    if (isNaN(pageNumber) || pageNumber <= 0 || isNaN(pageSizeNumber) || pageSizeNumber <= 0) {
        return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    try {
        // 댓글 총 개수 조회
        const totalItemCount = await prisma.comment.count({
            where: { postId: parseInt(postId) },
        });

        // 댓글 목록 조회 (페이지네이션 적용)
        const comments = await prisma.comment.findMany({
            where: { postId: parseInt(postId) },
            skip: (pageNumber - 1) * pageSizeNumber,
            take: pageSizeNumber,
            orderBy: {
                createdAt: 'desc', // 최신 댓글 순서로 정렬
            },
            select: {
                id: true,
                nickname: true,
                content: true,
                createdAt: true,
            },
        });

        const totalPages = Math.ceil(totalItemCount / pageSizeNumber);

        res.status(200).json({
            currentPage: pageNumber,
            totalPages,
            totalItemCount,
            data: comments,
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: '서버 오류입니다' });
    }
};

//댓글 수정 
const updateComment = async (req, res) => {
    const { commentId } = req.params;
    const { nickname, content, password } = req.body;

    // 요청 본문 유효성 검사
    if (!nickname || !content || !password) {
        return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    try {
        // 댓글 존재 확인
        const comment = await prisma.comment.findUnique({
            where: { id: parseInt(commentId) },
        });

        if (!comment) {
            return res.status(404).json({ message: '존재하지 않습니다' });
        }

        // 비밀번호 검증
        const isPasswordValid = await bcrypt.compare(password, comment.password);
        if (!isPasswordValid) {
            return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
        }

        // 댓글 업데이트
        const updatedComment = await prisma.comment.update({
            where: { id: parseInt(commentId) },
            data: {
                nickname,
                content,
            },
        });

        res.status(200).json({
            id: updatedComment.id,
            nickname: updatedComment.nickname,
            content: updatedComment.content,
            createdAt: updatedComment.createdAt,
        });
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ message: '서버 오류입니다' });
    }
};

//댓글 삭제 
const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const { password } = req.body;

    // 요청 본문 유효성 검사
    if (!password) {
        return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    try {
        // 댓글 존재 확인
        const comment = await prisma.comment.findUnique({
            where: { id: parseInt(commentId) },
        });

        if (!comment) {
            return res.status(404).json({ message: '존재하지 않습니다' });
        }

        // 비밀번호 검증
        const isPasswordValid = await bcrypt.compare(password, comment.password);
        if (!isPasswordValid) {
            return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
        }

        // 댓글 삭제
        await prisma.comment.delete({
            where: { id: parseInt(commentId) },
        });

        res.status(200).json({ message: '댓글 삭제 성공' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: '서버 오류입니다' });
    }
};

module.exports = {
    createComment,
    getComments,
    updateComment,
    deleteComment,

};
