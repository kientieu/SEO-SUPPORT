const { validationResult } = require('express-validator')
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt')
const wpapi = require('wpapi')

const satSiteAccModel = require('../../../models/sat_site_acc_model')
const postModel = require('../../../models/post_model')

async function post_to_wordpress(params) {
    const siteInfo = params.siteInfo

    const wp = new wpapi({
        endpoint: 'https://public-api.wordpress.com',
        username: siteInfo.username,
        password: siteInfo.password
    })

    const reqParams = JSON.parse(siteInfo.site_detail.params)
    const withMySite = withSite(reqParams.siteUrl)

    withMySite(wp.posts()).create({
        title: params.post.title,
        content: params.post.content,
        status: 'publish'
    }).then(response => {
        return {
            code: 200,
            message: 'Đăng bài viết lên Wordpress thành công',
            data: response
        }
    }).catch(err => {
        return {
            message: err.message,
            error: err
        }
    })
}

module.exports = {
    post_to_wordpress
}

function withSite(site) {
    return function (request) {
        return request.namespace(`wp/v2/sites/${site}`)
    }
}
