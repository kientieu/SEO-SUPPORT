const { validationResult } = require('express-validator')
const crypto = require('crypto-js')
const translate = require('google-translate-api-x')

const satSiteModel = require('../models/sat_site_model')
const siteDetailModel = require('../models/site_detail_model')
const satSiteAccModel = require('../models/sat_site_acc_model')
const postModel = require('../models/post_model')
const scheduleModel = require('../models/schedule_model')
const userModel = require('../models/user_model')

const satSiteHandler = require('./sat_site/sat_site_handler')

const processVal = require('../library/process_validation_result')
const returnJson = require('../library/json_type')
const convertKWToLP = require('../library/convert_kw_to_lp')
const convertKWToSiteLv2 = require('../library/convert_kw_to_site_lv2')
const convertDecodedPw = require('../library/convert_encrypted_pw')
const latinizeString = require('../library/latinize_string')
const getFilterModelWithRole = require('../library/get_filter_model_with_role')
const campaignModel = require("../models/campaign_model");

//Sat Site
async function get_sat_sites(req, res) {
    try {
        let filter = getFilterModelWithRole(res, {})
        const satSites = await satSiteModel.find(filter)

        returnJson(res, 200, 'Lấy danh sách thông tin site vệ tinh thành công', satSites)
    } catch (err) {
        return returnJson(res, 1, 'Lấy danh sách site vệ tinh thất bại. Vui lòng thử lại sau')
    }
}

async function add_sat_site(req, res) {
    try {
        let errors = validationResult(req)
        if (!errors.isEmpty()) {
            return returnJson(res, 1, processVal(errors))
        }

        let { url, name, hasApi, params, level } = req.body
        const newSatSite = new satSiteModel({
            url,
            name,
            has_api: hasApi,
            params,
            level,
        })
        const result = await newSatSite.save()
        let newSatSiteId = null
        if (result) {
            newSatSiteId = result._id
        }

        if (!eval(hasApi)) {
            const newSiteDetails = new siteDetailModel({
                url,
                site: newSatSiteId
            })
            await newSiteDetails.save()
        }

        return returnJson(res, 200, "Thêm site vệ tinh thành công")
    } catch (err) {
        return returnJson(res, 2, "Xảy ra lỗi trong quá trình thêm site vệ tinh. Vui lòng thử lại sau", null, null, 404)
    }
}

async function edit_sat_site(req, res) {
    try {
        let errors = validationResult(req)
        if (!errors.isEmpty()) {
            return returnJson(res, 1, processVal(errors))
        }

        let { sat_site_id } = req.params
        let { url, name, hasApi, params, level } = req.body

        const editSatSite = {
            url,
            name,
            has_api: hasApi,
            params,
            level,
        }
        let filter = getFilterModelWithRole(res, { _id: sat_site_id })
        let resultEditSite = await satSiteModel.findOneAndUpdate(filter, { $set: editSatSite })
        if (!resultEditSite) {
            return returnJson(res, 2, "Site vệ tinh không tồn tại. Vui lòng kiểm tra lại")
        }

        if (!eval(hasApi)) {
            const editSiteDetails = {
                url,
                site: sat_site_id,
            }
            let filter1 = getFilterModelWithRole(res, { site: sat_site_id })
            let resultEditSiteDetails = await satSiteModel.findOneAndUpdate(filter1, { $set: editSiteDetails })
            if (!resultEditSiteDetails) {
                return returnJson(res, 3, "Site vệ tinh không tồn tại. Vui lòng kiểm tra lại")
            }
        }

        return returnJson(res, 200, "Chỉnh sửa site vệ tinh thành công")
    } catch (err) {
        return returnJson(res, 4, "Xảy ra lỗi trong quá trình chỉnh sửa site vệ tinh. Vui lòng thử lại sau", null, err, 404)
    }
}

async function post_to_site_level(req, res) {
    try {
        let site = req.query.site
        let level = req.query.level
        if (!site) {
            return returnJson(res, 2, 'Thiếu giá trị site cần đăng. Vui lòng kiểm tra lại')
        }
        if (!level) {
            return returnJson(res, 3, 'Thiếu giá trị level của site cần đăng. Vui lòng kiểm tra lại')
        }

        let params = req.body
        level = parseInt(level)
        params['site'] = site
        params['level'] = level
        params['res'] = res

        switch (level) {
            case 2: // Logic for site level 2 (pyramid SEO model)
                const resultCase2 = await post_to_site_lv2(params)
                if (resultCase2.code === 200) {
                    return returnJson(res, resultCase2.code, resultCase2.message, resultCase2.data)
                }
                return returnJson(res, resultCase2.code, resultCase2.message, null, resultCase2.error)
            case 3: // Logic for site level 3 (case user self call site level 3)
                const resultCase3 = await post_to_site_lv3(params)
                if (resultCase3.code === 200) {
                    return returnJson(res, resultCase3.code, resultCase3.message, resultCase3.data)
                }
                return returnJson(res, resultCase3.code, resultCase3.message, null, resultCase3.error)
            default:
                return returnJson(res, 4, 'Giá trị level của site không hợp lệ. Vui lòng kiểm tra lại')
        }
    } catch (err) {
        return returnJson(res, 1, 'Xảy ra lỗi trong quá trình đăng lên site vệ tinh. Vui lòng thử lại sau', null, err)
    }
}

async function post_to_site(params) {
    try {
        let funcName = `post_to_${params.site}`

        let postId = params.postId
        let filter = getFilterModelWithRole(params.res, { _id: postId })
        let post = await postModel.findOne(filter)
            .populate('topic')
            .populate('keyword')
            .populate('landing_page')
        if (!post) {
            return {
                code: 2,
                message: 'Không tồn tại bài viết này. Vui lòng kiểm tra lại'
            }
        }

        let siteAccId = params.siteAccId
        let filter1 = getFilterModelWithRole(params.res, { _id: siteAccId })
        let siteInfo = await satSiteAccModel
                .findOne(filter1)
                .populate('site_detail')
        if (!siteInfo) {
            return {
                code: 3,
                message: 'Không tồn tại tài khoản này. Vui lòng kiểm tra lại'
            }
        }

        switch (params.level) {
            case 2:
                // Convert SEO keyword to landing page in post content
                post['content'] = convertKWToLP(post.keyword.name, post.landing_page.url, post.content)
                break
            case 3:
                // Convert SEO keyword to site level 2 URL in post content
                if (params.acceptTranslate) {
                    const { translatedTitle, translatedContent } = await translate_content(post.title, post.content)
                    post['title'] = translatedTitle
                    post['content'] = translatedContent
                }
                post['content'] = convertKWToSiteLv2(post.keyword.name, params.siteLv2Url, post.content)
                break
        }
        siteInfo['password'] = convertDecodedPw(siteInfo.username, siteInfo.created_at, siteInfo.password)
        params['post'] = post
        params['siteInfo'] = siteInfo

        let result = await satSiteHandler[funcName](params)
        let resultJson = JSON.stringify(result)

        if (params.scheduleId) {
            if (result.code !== 200) {
                await scheduleModel.findByIdAndUpdate(params.scheduleId, { status: "Thất bại", result: resultJson })
                return {
                    code: 4,
                    message: result.message,
                    error: result.error
                }
            }
            await scheduleModel.findByIdAndUpdate(params.scheduleId, { status: 'Thành công', result: resultJson })
            return {
                code: 200,
                message: result.message,
                data: result.data
            }
        }

        if (result.code !== 200) {
            const newFailedManualSch = new scheduleModel({
                post_type: 'Manual',
                date: new Date(),
                author: post.author,
                status: 'Thất bại',
                result: resultJson,
                sat_site: params.satSiteId,
                site_acc_info: siteAccId,
                post_info: postId
            })
            await newFailedManualSch.save()
            return {
                code: 5,
                message: result.message,
                error: result.error
            }
        }

        const newManualSch = new scheduleModel({
            post_type: 'Manual',
            date: new Date(),
            author: post.author,
            status: 'Thành công',
            result: resultJson,
            sat_site: params.satSiteId,
            site_acc_info: siteAccId,
            post_info: postId
        })
        const addSchResult = await newManualSch.save()
        let newSchId = null
        if (addSchResult) {
            newSchId = addSchResult._id
        }

        let data = result.data
        data['resultId'] = newSchId
        return {
            code: 200,
            message: result.message,
            data
        }
    } catch (err) {
        return {
            code: 1,
            message: `Xảy ra lỗi trong quá trình đăng lên site vệ tinh ${params.site}. Vui lòng thử lại sau`,
            error: err
        }
    }
}

async function post_to_site_lv2(params) {
    try {
        // 1. call post_to_site() for site level 2
        const resultPostToSiteLv2 = await post_to_site(params)
        if (resultPostToSiteLv2.code === 200) {
            if (params.scheduleId && params.acceptSiteLv3) {
                // 2. query DB with site level 3
                const siteLv3 = await satSiteModel.find({ level: { $eq: 3 }, name: "Rao vặt" })
                if (!siteLv3) {
                    return {
                        code: 200,
                        message: resultPostToSiteLv2.message,
                        data: resultPostToSiteLv2.data
                    }
                }
                const randSiteLv3 = siteLv3[Math.floor(Math.random() * siteLv3.length)]
                const siteDetailsLv3 = await siteDetailModel.find({ site: randSiteLv3._id })
                if (!siteDetailsLv3) {
                    return {
                        code: 200,
                        message: resultPostToSiteLv2.message,
                        data: resultPostToSiteLv2.data
                    }
                }
                const randSiteDetailsLv3 = siteDetailsLv3[Math.floor(Math.random() * siteDetailsLv3.length)]
                const siteAccLv3 = await satSiteAccModel.find({ site_detail: randSiteDetailsLv3._id })
                if (!siteAccLv3) {
                    return {
                        code: 200,
                        message: resultPostToSiteLv2.message,
                        data: resultPostToSiteLv2.data
                    }
                }
                const randSiteAccLv3 = siteAccLv3[Math.floor(Math.random() * siteAccLv3.length)]

                let siteNameLv3 = randSiteLv3.name.replace(/\s/g, '')
                siteNameLv3 = siteNameLv3.toLowerCase()
                siteNameLv3 = latinizeString.latinize(siteNameLv3)
                const paramsForSiteLv3 = {
                    site: siteNameLv3,
                    level: 3,
                    res: params.res,
                    postId: params.postId,
                    satSiteId: randSiteLv3._id,
                    siteAccId: randSiteAccLv3._id,
                    siteLv2Url: resultPostToSiteLv2.data.postAtSiteUrl,
                    acceptTranslate: params.acceptTranslate,
                }
                // 3. call post_to_site() for site level 3 (query from step 2)
                const resultPostToSiteLv3 = await post_to_site(paramsForSiteLv3)

                let finalMsg = {
                    siteLv2Msg: resultPostToSiteLv2.message,
                    siteLv3Msg: resultPostToSiteLv3.message,
                }
                let finalData = {
                    siteLv2Data: resultPostToSiteLv2.data,
                }
                if (resultPostToSiteLv3.code === 200) {
                    finalData['siteLv3Data'] = resultPostToSiteLv3.data
                    return {
                        code: 200,
                        message: finalMsg,
                        data: finalData
                    }
                }
                return {
                    code: 200,
                    message: finalMsg,
                    data: finalData,
                    error: resultPostToSiteLv3.error
                }
            }

            return {
                code: 200,
                message: resultPostToSiteLv2.message,
                data: resultPostToSiteLv2.data
            }
        }

        return {
            code: 6,
            message: resultPostToSiteLv2.message,
            error:  resultPostToSiteLv2.error
        }
    } catch (err) {
        return {
            code: 5,
            message: 'Đăng lên site vệ tinh tầng 2 thất bại. Vui lòng thử lại sau',
            error:  err
        }
    }
}

async function post_to_site_lv3(params) {
    // 1. call post_to_site() for site level 3
    try {
        const resultPostToSiteLv3 = await post_to_site(params)
        if (resultPostToSiteLv3.code === 200) {
            return {
                code: 200,
                message: resultPostToSiteLv3.message,
                data: resultPostToSiteLv3.data
            }
        }

        return {
            code: 8,
            message: resultPostToSiteLv3.message,
            error:  resultPostToSiteLv3.error
        }
    } catch (err) {
        return {
            code: 7,
            message: 'Đăng lên site vệ tinh tầng 2 thất bại. Vui lòng thử lại sau',
            error:  err
        }
    }
}

//Site Detail
async function get_site_detail(req, res) {
    let { sat_site_id } = req.params
    try {
        const satSite = await satSiteModel.findById(sat_site_id)
        let filter = getFilterModelWithRole(res, { site: satSite })
        let filter1 = { site: satSite, author: { $exists: false } }
        const siteDetail = await siteDetailModel.find({ $or: [filter, filter1] })

        let siteAcc = {}
        for (const detail of siteDetail) {
            try {
                siteAcc[`${detail._id}`] = await satSiteAccModel.find({ site_detail: detail._id })
            } catch (err) {
                return returnJson(res, 1, 'Lấy danh sách tài khoản site vệ tinh thất bại. Vui lòng thử lại sau', null, err)
            }
        }

        return returnJson(res, 200, 'Lấy chi tiết site vệ tinh thành công', { satSite, siteDetail, siteAcc })
    } catch (err) {
        return returnJson(res, 2, 'Lấy chi tiết site vệ tinh thất bại. Vui lòng thử lại sau', null, err, 404)
    }
}

async function add_site_detail(req, res) {
    try {
        let errors = validationResult(req)
        if (!errors.isEmpty()) {
            return returnJson(res, 1, processVal(errors), null, null, 404)
        }

        let { url, params } = req.body
        let { sat_site_id } = req.params
        if (url.charAt(url.length - 1) === '/') {
            url = url.slice(0, -1)
        }
        if (!isJsonObject(params)) {
            return returnJson(res, 2, "Trường params phải ở định dạng JSON String", null, null, 404)
        }

        const newSiteDetail = new siteDetailModel({
            url,
            params,
            site: sat_site_id
        })
        await newSiteDetail.save()

        return returnJson(res, 200, "Thêm chi tiết site vệ tinh thành công")
    } catch (err) {
        return returnJson(res, 3, "Xảy ra lỗi trong quá trình thêm chi tiết site vệ tinh. Vui lòng thử lại sau", null, null, 404)
    }
}

//Site Acc
async function add_new_site_acc(req, res) {
    let { siteDetails, newUsername, newPwd } = req.body

    try {
        const isSiteAccExist = await satSiteAccModel.findOne({ username: newUsername, site_detail: siteDetails._id })
        if (isSiteAccExist) {
            return returnJson(res, 3, `Tài khoản đã tồn tại trong site vệ tinh ${siteDetails.url}`)
        }

        const created_at = new Date()
        const key = newUsername + '/' + created_at.toISOString()

        const encryptedPwd = crypto.AES.encrypt(newPwd, key).toString()
        const newSiteAcc = new satSiteAccModel({
            username: newUsername,
            password: encryptedPwd,
            site_detail: siteDetails._id,
            user: res.locals.user.user_id,
            created_at
        })
        await newSiteAcc.save()
        return returnJson(res, 200, `Thêm tài khoản mới cho site vệ tinh ${siteDetails.url} thành công`)
    } catch (err) {
        return returnJson(res, 1, "Thêm tài khoản mới cho site vệ tinh thất bại. Vui lòng thử lại sau", null, err)
    }
}

async function translate_content(postTitle, postContent) {
    const inputObj = {
        postTitle,
        postContent
    }
    const result = await translate(inputObj, { from: 'vi', to: 'en' })

    return {
        translatedTitle: result.postTitle.text,
        translatedContent: result.postContent.text
    }
}

module.exports = {
    get_sat_sites,
    add_sat_site,
    edit_sat_site,
    post_to_site_level,
    get_site_detail,
    add_site_detail,
    add_new_site_acc
}

function isJsonObject(strData) {
    try {
        JSON.parse(strData)
    } catch (err) {
        return false
    }
    return true
}
