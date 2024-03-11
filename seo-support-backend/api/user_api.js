const { ACCESS_TOKEN_SECRET, BASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const googleStrategy = require('passport-google-oauth20').Strategy
const fs = require('fs')

const userModel = require('../models/user_model')

async function process_login(req, res) {
    try {
        let errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log(errors)
            let messages = errors.array().map(error => {
                return error.msg
            })
            return res.json({
                code: 1,
                message: messages
            })
        }
        let { email, password } = req.body
        let user = await userModel.findOne({ email })
        if (!user) {
            return res.json({
                code: 2,
                message: 'Email hoặc password không chính xác'
            })
        }
        if (!bcrypt.compareSync(password, user.password)) {
            return res.json({
                code: 3,
                message: 'Email hoặc password không chính xác'
            })
        }

        jwt.sign({
            user_id: user._id,
            user_role: user.role,
        }, ACCESS_TOKEN_SECRET, {
            expiresIn: '24h'
        }, (err, token) => {
            if (err) {
                console.trace(err)
                return res.json({
                    code: 4,
                    message: 'Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại sau',
                    error: err.message
                })
            }
            return res.json({
                code: 200,
                message: 'Đăng nhập thành công',
                user,
                token
            })
        })
    } catch (err) {
        console.trace(err)
        return res.json({
            code: 5,
            message: 'Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại sau',
            error: err.message
        })
    }
}

async function process_register(req, res, next) {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json({
            code: 1,
            message: errors.array()
        })
    }
    let { name, email, password, confirmPwd, phone } = req.body
    // console.log(name, email, password, confirmPwd, phone)
    let user = await userModel.findOne({ email })
    if (user) {
        return res.json({
            code: 1,
            message: 'Email đã tồn tại. Vui lòng nhập email khác'
        })
    }
    if (confirmPwd !== password) {
        return res.json({
            code: 1,
            message: 'Mật khẩu và xác nhận mật khẩu không khớp'
        })
    }
    let hashedPwd = bcrypt.hashSync(password, 10)
    user = new userModel({
        name,
        email,
        password: hashedPwd,
        role: 'user',
        phone
    })
    await user.save((err) => {
        if (err) {
            return res.json({
                code: 1,
                message: 'Đã xảy ra lỗi trong quá trình tạo tài khoản. Vui lòng thử lại sau'
            })
        }
        return res.json({
            code: 200,
            message: 'Tạo tài khoản thành công'
        })
    })
}

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser((req, id, done) => {
    userModel.findById(id)
        .then(user => {

            done(null, user)
        })
        .catch(err => done(err, null))
})

function get_google_auth_user(req, res) {
    try {
        let user = req.user
        if (!user) {
            return res.json({
                code: 1,
                message: 'Đã xảy ra lỗi trong quá trình đăng nhập bằng Google. Vui lòng thử lại sau',
            })
        }
        jwt.sign({
            user_id: user._id,
            user_role: user.role,
        }, ACCESS_TOKEN_SECRET, {
            expiresIn: '24h'
        }, (err, token) => {
            if (err) {
                console.trace(err)
                return res.json({
                    code: 2,
                    message: 'Đã xảy ra lỗi trong quá trình đăng nhập bằng Google. Vui lòng thử lại sau',
                    error: err
                })
            }
            // console.log(user, token)
            req.session.destroy((err1) => {
                if (err1) {
                    console.trace(err1)
                    return res.json({
                        code: 3,
                        message: 'Đã xảy ra lỗi trong quá trình đăng nhập bằng Google. Vui lòng thử lại sau',
                        error: err1
                    })
                }
                return res.status(200)
                    .clearCookie('connect.sid', { path: '/' })
                    .json({
                        code: 200,
                        message: 'Đăng nhập bằng Google thành công',
                        user,
                        token
                    })
            })
        })
    } catch (err) {
        console.trace(err)
        return res.json({
            code: 4,
            message: 'Đã xảy ra lỗi trong quá trình đăng nhập bằng Google. Vui lòng thử lại sau',
            error: err.message
        })
    }
}

async function check_auth_user(req, res) {
    try {
        const user = await userModel.findById(res.locals.user.user_id)

        return res.json({
            code: 200,
            message: "Token hợp lệ",
            data: user
        })
    } catch (err) {
        console.trace(err)
        return res.json({
            code: 1,
            message: "Có lỗi xảy ra trong quá trình xác thực người dùng. Vui lòng thử lại sau",
            error: err.message
        })
    }
}

passport.use('google', new googleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${BASE_URL}/auth/google/callback`
    },
    (accessToken, refreshToken, profile, done) => {
        // console.log(profile)
        let email = profile.emails[0].value
        userModel.findOne({ email })
            .then(user => {
                if (user) {
                    return done(null, user)
                }
                new userModel({
                    email: profile.emails[0].value,
                    role: 'user',
                    name: profile.displayName,
                    avatar: profile.photos[0].value
                }).save()
                    .then(user => done(null, user))
                    .catch(err => done(err, null))
            })
            .catch(err => {
                if(err) {
                    return done(err, null)
                }
            })
    }
))

module.exports = {
    process_login,
    process_register,
    get_google_auth_user,
    check_auth_user,
}