module.exports = (res, code, message, data=null, error=null, statusCode=200) => {
    if (error) {
        console.trace(error)
        return res.status(statusCode).json({
            code,
            message,
            error: error.message
        })
    }
    if (data) {
        return res.status(statusCode).json({
            code,
            message,
            data
        })
    }
    return res.status(statusCode).json({
        code,
        message
    })
}