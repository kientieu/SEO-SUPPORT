const express = require('express');
const router = express.Router();
const { body } = require('express-validator')

const postApi = require('../api/post_api')

const checkLogin = require('../middleware/check_login')

router.get('/posts', checkLogin, postApi.get_posts)

router.get('/origin-posts', checkLogin, postApi.get_origin_posts)

router.get('/spin-posts', checkLogin, postApi.get_spin_posts)

router.post(/\/post\/auto-score/g, checkLogin, postApi.score_post_by_ai)

router.get('/post/:post_id', checkLogin, postApi.get_post_details)

router.post('/posts',
    body('postTitle')
        .trim().isLength({ min: 1 }).withMessage('Vui lòng nhập tiêu đề bài viết'),
    body('postContent')
        .trim().isLength({ min: 1 }).withMessage('Vui lòng nhập nội dung tiêu đề bài viết'),
    body('postTopic')
        .trim().isLength({ min: 1 }).withMessage('Thiếu chủ đề bài viết'),
    body('keyword')
        .trim().isLength({ min: 1 }).withMessage('Thiếu từ khoá SEO cho bài viết'),
    body('landingPage')
        .trim().isLength({ min: 1 }).withMessage('Thiếu landing page cho bài viết'),
    checkLogin,
    postApi.add_new_post)

router.put('/post/modify/:post_id',
    body('postTitle')
        .trim().isLength({ min: 1 }).withMessage('Vui lòng nhập tiêu đề bài viết'),
    body('postContent')
        .trim().isLength({ min: 1 }).withMessage('Vui lòng nhập nội dung tiêu đề bài viết'),
    body('postTopic')
        .trim().isLength({ min: 1 }).withMessage('Thiếu chủ đề bài viết'),
    body('keyword')
        .trim().isLength({ min: 1 }).withMessage('Thiếu từ khoá SEO cho bài viết'),
    body('landingPage')
        .trim().isLength({ min: 1 }).withMessage('Thiếu landing page cho bài viết'),
    checkLogin,
    postApi.edit_post)

router.get('/post/modify/check/:post_id', checkLogin, postApi.check_post_exist_schedule)

router.delete('/post/modify/:post_id', checkLogin, postApi.delete_post)

router.get('/post/spinner/:post_id', checkLogin, postApi.spin_posts)

router.post('/post/spinner/:post_id', checkLogin, postApi.add_spin_post)

module.exports = router;
