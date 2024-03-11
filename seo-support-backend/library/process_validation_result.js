module.exports = (errors) => {
    console.log(errors)
    return errors.array().map(error => {
        return error.msg
    })
}