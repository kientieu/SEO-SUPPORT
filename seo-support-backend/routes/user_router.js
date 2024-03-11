const express = require('express');
const router = express.Router();
const { FE_URL } = process.env
const { body } = require('express-validator')
const passport = require('passport')

const userApi = require('../api/user_api')

const checkLogin = require('../middleware/check_login')

router.post('/login',
    body('email')
        .trim().isLength({ min: 1 }).withMessage('Vui lòng nhập Email'),
    userApi.process_login)

router.post('/register',
    body('name')
        .notEmpty()
        .withMessage('Vui lòng nhập tên'),
    body('email')
        .notEmpty().withMessage('Vui lòng nhập Email')
        .isEmail().withMessage('Vui lòng nhập đúng định dạng Email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Mật khẩu phải tối thiểu 6 kí tự'),
    userApi.process_register)

router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }))
router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: `${FE_URL}/login/success`,
    failureRedirect: `${FE_URL}/login/fail`,
}))
router.get('/auth/google/user', userApi.get_google_auth_user)

router.get('/auth/user', checkLogin, userApi.check_auth_user)

router.get('/', ((_req, res) => {
    res.json({
        code: 200,
        message: 'Server đang hoạt động'
    })
}))

module.exports = router;
