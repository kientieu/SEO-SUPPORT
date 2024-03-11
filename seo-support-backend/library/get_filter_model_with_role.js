module.exports = (res, baseFilterObj) => { // type of baseFilterObj = { ... }. e.g. baseFilterObj = { _id: campaign_id }
    let user = res.locals.user
    let filter = baseFilterObj
    switch (user.user_role) {
        case 'user':
            filter['author'] = user.user_id
            break
        default:
            break
    }

    return filter
}