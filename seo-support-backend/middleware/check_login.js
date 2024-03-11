const jwt = require('jsonwebtoken')
const { ACCESS_TOKEN_SECRET } = process.env

module.exports = (req, res, next) => {
    let authorization = req.header("Authorization")
    if (!authorization) {
        return res.status(401)
            .json({
                code: 401,
                message: "Vui lòng cung cấp jwt token thông qua header"
            })
    }
    let token = authorization.split(" ")[1];
    console.log("Request Token:", token)

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) {
            return res.status(401)
                .json({
                    code: 401,
                    message: "Token không hợp lệ hoặc đã hết hạn"
                })
        }
        res.locals.user = data
        next()
    })
}