module.exports = (res, baseFilterObj) => { // type of baseFilterObj = { ... }. e.g. baseFilterObj = { name: kwName }
    let user = res.locals.user
    let filter = baseFilterObj
    switch (user.user_role) {
        case 'user':
            filter['updated_by'] = user.user_id
            break
        default:
            break
    }

    return filter
}