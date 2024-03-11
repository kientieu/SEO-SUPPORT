module.exports = (code, message, data=null, error=null) => {
    if (error) {
        console.error(error)
        return {
            code,
            message,
            error: error.message
        }
    }
    if (data) {
        return {
            code,
            message,
            data
        }
    }
    return {
        code,
        message
    }
}