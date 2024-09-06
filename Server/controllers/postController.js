const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');


//게시글 등록 
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
   
        // 배지 조건 확인
       

        // 성공적으로 생성된 게시글 반환
        res.status(200).json(newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: '서버 오류입니다' });
    }
};

//게시글 목록 조회 
const getPosts = async (req, res) => {
    const { groupId } = req.params;
    const { page = 1, pageSize = 10, sortBy = 'latest', keyword = '', isPublic } = req.query;

    const pageNumber = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const pageSizeNumber = parseInt(pageSize, 10) > 0 ? parseInt(pageSize, 10) : 10;
    const isPublicBoolean = isPublic !== undefined ? isPublic === 'true' : undefined;

    let orderBy;
    switch (sortBy) {
        case 'mostCommented':
            orderBy = { commentCount: 'desc' };
            break;
        case 'mostLiked':
            orderBy = { likeCount: 'desc' };
            break;
        case 'latest':
        default:
            orderBy = { createdAt: 'desc' };
            break;
    }

    try {
        const whereClause = {
            groupId: parseInt(groupId),
            title: {
                contains: keyword,
                mode: 'insensitive',
            },
            ...(isPublicBoolean !== undefined && { isPublic: isPublicBoolean })
        };

        const [totalItemCount, posts] = await Promise.all([
            prisma.post.count({ where: whereClause }),
            prisma.post.findMany({
                where: whereClause,
                orderBy,
                skip: (pageNumber - 1) * pageSizeNumber,
                take: pageSizeNumber,
                select: {  // 여기서 선택적으로 필드만 반환
                    id: true,
                    nickname: true,
                    title: true,
                    imageUrl: true,
                    tags: true,
                    location: true,
                    moment: true,
                    isPublic: true,
                    likeCount: true,
                    commentCount: true,
                    createdAt: true,
                    // password 필드를 제외합니다.
                },
            }),
        ]);

        const totalPages = Math.ceil(totalItemCount / pageSizeNumber);

        res.status(200).json({
            currentPage: pageNumber,
            totalPages,
            totalItemCount,
            data: posts,
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: '서버 오류입니다' });
    }
};

//게시글 수정 
const updatePost = async (req, res) => {
    const { postId } = req.params;
    const {
        nickname,
        title,
        content,
        postPassword,
        imageUrl,
        tags,
        location,
        moment,
        isPublic
    } = req.body;

    // 요청 본문 유효성 검사
    if (!nickname || !title || !content || !postPassword || !imageUrl || !moment) {
        return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    try {
        // 게시글 존재 확인
        const post = await prisma.post.findUnique({
            where: { id: parseInt(postId) },
        });

        if (!post) {
            return res.status(404).json({ message: "존재하지 않습니다" });
        }

        // 비밀번호 검증
        const isPasswordValid = await bcrypt.compare(postPassword, post.password);

        if (!isPasswordValid) {
            return res.status(403).json({ message: "비밀번호가 틀렸습니다" });
        }

        // 게시글 수정
        const updatedPost = await prisma.post.update({
            where: { id: parseInt(postId) },
            data: {
                nickname,
                title,
                content,
                imageUrl,
                tags,
                location,
                moment: new Date(moment),
                isPublic,
            },
        });

        res.status(200).json(updatedPost);
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: '서버 오류입니다' });
    }
};

//게시글 삭제 
const deletePost = async (req, res) => {
    const { postId } = req.params;
    const { postPassword } = req.body;

    // 요청 본문 유효성 검사
    if (!postPassword) {
        return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    try {
        // 게시글 존재 확인
        const post = await prisma.post.findUnique({
            where: { id: parseInt(postId) },
        });

        if (!post) {
            return res.status(404).json({ message: '존재하지 않습니다' });
        }

        // 비밀번호 검증
        const isPasswordValid = await bcrypt.compare(postPassword, post.password);

        if (!isPasswordValid) {
            return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
        }

        // 게시글 삭제
        await prisma.post.delete({
            where: { id: parseInt(postId) },
        });

        res.status(200).json({ message: '게시글 삭제 성공' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: '서버 오류입니다' });
    }
};

//그룹 상세 정보 조회 
const getPostDetails = async (req, res) => {
    const { postId } = req.params;

    // 요청 본문 유효성 검사
    if (!postId || isNaN(postId)) {
        return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    try {
        // 게시글 존재 확인 및 상세 정보 조회
        const post = await prisma.post.findUnique({
            where: { id: parseInt(postId) },
            select: {  // select를 사용하여 password 필드를 제외
                id: true,
                groupId: true,
                nickname: true,
                title: true,
                content: true,
                imageUrl: true,
                tags: true,
                location: true,
                moment: true,
                isPublic: true,
                likeCount: true,
                commentCount: true,
                createdAt: true,
                // password 필드를 명시적으로 제외
            },
        });

        if (!post) {
            return res.status(404).json({ message: "존재하지 않습니다" });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching post details:', error);
        res.status(500).json({ message: '서버 오류입니다' });
    }
};

//게시글 조회 권환 확인 
const verifyPostPassword = async (req, res) => {
    const { postId } = req.params;
    const { password } = req.body;

    // 요청 본문 유효성 검사
    if (!password) {
        return res.status(400).json({ message: '비밀번호를 제공해 주세요' });
    }

    try {
        // 게시글 존재 확인
        const post = await prisma.post.findUnique({
            where: { id: parseInt(postId) },
        });

        if (!post) {
            return res.status(404).json({ message: '존재하지 않습니다' });
        }

        // 비밀번호 검증
        const isPasswordValid = await bcrypt.compare(password, post.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: '비밀번호가 틀렸습니다' });
        }

        res.status(200).json({ message: '비밀번호가 확인되었습니다' });
    } catch (error) {
        console.error('Error verifying post password:', error);
        res.status(500).json({ message: '서버 오류입니다' });
    }
};

//게시글 공감하기 
const likePost = async (req, res) => {
    const { postId } = req.params;

    try {
        // 게시글 존재 확인
        const post = await prisma.post.findUnique({
            where: { id: parseInt(postId) },
        });

        if (!post) {
            return res.status(404).json({ message: '존재하지 않습니다' });
        }

        // 게시글 공감 수 증가
        await prisma.post.update({
            where: { id: parseInt(postId) },
            data: {
                likeCount: post.likeCount + 1,
            },
        });


        res.status(200).json({ message: '게시글 공감하기 성공' });
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ message: '서버 오류입니다' });
    }
};

//게시글 공개 여부 확인 
const getPostPublicStatus = async (req, res) => {
    const { postId } = req.params;

    // 요청 본문 유효성 검사
    if (!postId || isNaN(postId)) {
        return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    try {
        // 게시글 존재 확인 및 공개 여부 조회
        const post = await prisma.post.findUnique({
            where: { id: parseInt(postId) },
            select: {
                id: true,
                isPublic: true,
            },
        });

        if (!post) {
            return res.status(404).json({ message: "존재하지 않습니다" });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching post public status:', error);
        res.status(500).json({ message: '서버 오류입니다' });
    }
};



module.exports = {
    createPost,
    getPosts,
    updatePost,
    deletePost,
    getPostDetails,
    verifyPostPassword,
    likePost,
    getPostPublicStatus,
};
