module.exports = (req, res, next) => {
    let userRole = res.locals.user.user_role
    if (userRole.toLowerCase() !== "admin") {
        return res.status(403)
            .json({
                code: 403,
                message: "Chỉ có quyền admin mới có thể sử dụng API này"
            })
    }

    next()
}