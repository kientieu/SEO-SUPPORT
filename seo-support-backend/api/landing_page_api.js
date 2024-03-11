const { validationResult } = require('express-validator')
const fs = require('fs')
const mongoose = require('mongoose')
const readXlsxFile = require('read-excel-file/node')

const landingPageModel = require('../models/landing_page_model')
const campaignModel = require('../models/campaign_model')
const keywordModel = require('../models/keyword_model')

const processVal = require('../library/process_validation_result')
const getFilterModelWithRole = require('../library/get_filter_model_with_role')
const filterKWModelWithRole = require('../library/filter_keyword_model_with_role')
const baseReturnJsonType = require('../library/base_return_json_type')
const validateInputExcelFile = require('../library/validate_input_excel_file')

const tempDataPath = './user_data/temp_data'

async function get_landing_pages(req, res) {
    let { campaign_id } = req.params
    try {
        let campaign = await handle_campaign_id(req, res, campaign_id)

        let filter = getFilterModelWithRole(res, { campaign: campaign_id })
        let landingPages = await landingPageModel.find(filter)
            .populate('author')
            .populate('main_kw')

        return res.json({
            code: 200,
            message: 'Lấy danh sách landing page thành công',
            data: {
                campaign,
                landingPages
            }
        })
    } catch (err) {
        console.trace(err)
        return res.json({
            code: 1,
            message: 'Xảy ra lỗi trong quá trình lấy landing page của chiến dịch. Vui lòng thử lại sau',
            error: err.message
        })
    }
}

async function add_landing_pages(req, res) {
    try {
        let errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.json({
                code: 1,
                message: processVal(errors)
            })
        }
        let { campaign_id } = req.params
        await handle_campaign_id(req, res, campaign_id)
        let { campaignID, kwName, lpURL } = req.body

        kwName = kwName.toLowerCase()
        let filter1 = filterKWModelWithRole(res, { name: kwName })
        const kw = await keywordModel.findOne(filter1)
        if (kw) {
            let filter2 = getFilterModelWithRole(res, { campaign: campaignID, main_kw: kw._id })
            let filter3 = getFilterModelWithRole(res, { campaign: campaignID, sub_kw: kw._id })
            const kwExistedInCampaign = await landingPageModel.findOne({ $or: [filter2, filter3] })
            if (kwExistedInCampaign) {
                return res.json({
                    code: 2,
                    message: 'Từ khoá này đã tồn tại trong chiến dịch. Vui lòng kiểm tra lại',
                })
            }
        }

        const lPUrlExisted = await landingPageModel
            .findOne({ campaign: campaignID, url: lpURL  })
        if (lPUrlExisted) {
            return res.json({
                code: 3,
                message: 'Landing page này đã tồn tại trong chiến dịch. Vui lòng kiểm tra lại',
            })
        }

        let kwObj = {
            name: kwName,
            updated_by: res.locals.user.user_id,
            created_at: new Date()
        }
        let result = await keywordModel.findOneAndUpdate({ name: kwName },
            { $set: kwObj }, { upsert: true, new: true })

        let newLP = new landingPageModel({
            url: lpURL,
            author: res.locals.user.user_id,
            campaign: campaign_id,
            main_kw: result._id,
            created_at: new Date()
        })

        await newLP.save()

        return res.json({
            code: 200,
            message: 'Tạo landing page thành công'
        })
    } catch (err) {
        console.error(err)
        return res.json({
            code: 4,
            message: 'Xảy ra lỗi trong quá trình tạo landing page. Vui lòng thử lại sau',
            error: err.message
        })
    }
}

async function add_lp_by_excel(req, res) {
    try {
        const file = req.file
        const validate = validateInputExcelFile(file)
        if (validate.code !== 200) {
            return res.json(baseReturnJsonType(validate.code, validate.message))
        }

        const schema = {
            'LANDING PAGE URL': {
                // JSON object property name.
                prop: 'lpUrl',
                type: String,
            },
            'TỪ KHOÁ': {
                prop: 'keyword',
                type: String,
            },
        }

        const { rows, errors } = await readXlsxFile(fs.createReadStream(`${tempDataPath}/${file.filename}`), { schema })
        if (errors.length) {
            // console.log(errors)
            let errorInTitle = {}
            for (const error of errors) {
                errorInTitle[`${error.column}`] = `Tên tiêu đề không đúng như mẫu: ${error.column}`
            }

            return res.json({
                code: 4,
                message: 'Thêm chiến dịch bằng excel thất bại. Vui lòng thử lại sau',
                error: errorInTitle,
            })
        }

        let newLPAdded = []
        let validUrl = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$', 'i')
        let invalidName = /[~`!#$%^&*+=\-\\[\]';,/{}|":<>?]/g
        for (const row of rows) {
            let lpUrl = row.lpUrl
            let keyword = row.keyword
            let lpUrlVal = `LP URL: ${lpUrl}`
            let keywordVal = `Từ khoá: ${keyword}`
            if (!lpUrl) {
                newLPAdded.push({
                    keyword: keywordVal,
                    message: 'Thiếu landing page url cho từ khoá',
                })
                continue
            }
            if (!keyword) {
                newLPAdded.push({
                    lpUrl: lpUrlVal,
                    message: 'Thiếu từ khoá cho landing page',
                })
                continue
            }

            if (!lpUrl.match(validUrl)) {
                newLPAdded.push({
                    lpUrl: lpUrlVal,
                    keyword: keywordVal,
                    message: 'Sai định dạng url cho landing page',
                })
                continue
            }

            if (keyword.match(invalidName)) {
                newLPAdded.push({
                    lpUrl: lpUrlVal,
                    keyword: keywordVal,
                    message: 'Từ khoá có chứa kí tự đặc biệt',
                })
                continue
            }

            let { campaign_id } = req.params
            keyword = keyword.toLowerCase()
            let filter1 = filterKWModelWithRole(res, { name: keyword })
            const kwExisted = await keywordModel.findOne(filter1)
            if (kwExisted) {
                let filter2 = getFilterModelWithRole(res, { campaign: campaign_id, main_kw: kwExisted._id })
                let filter3 = getFilterModelWithRole(res, { campaign: campaign_id, sub_kw: kwExisted._id })
                const kwExistedInCampaign = await landingPageModel.findOne({ $or: [filter2, filter3] })
                if (kwExistedInCampaign) {
                    newLPAdded.push({
                        lpUrl: lpUrlVal,
                        keyword: keywordVal,
                        message: `Từ khoá đã tồn tại trong chiến dịch`,
                    })
                    continue
                }
            }

            const lPUrlExisted = await landingPageModel
                .findOne({ campaign: campaign_id, url: lpUrl  })
            if (lPUrlExisted) {
                newLPAdded.push({
                    lpUrl: lpUrlVal,
                    keyword: keywordVal,
                    message: `Landing page đã tồn tại trong chiến dịch`,
                })
                continue
            }

            let kwObj = {
                name: keyword,
                updated_by: res.locals.user.user_id,
                created_at: new Date()
            }
            let result = await keywordModel.findOneAndUpdate({ name: keyword },
                { $set: kwObj }, { upsert: true, new: true })

            let newLP = new landingPageModel({
                url: lpUrl,
                author: res.locals.user.user_id,
                campaign: campaign_id,
                main_kw: result._id,
                created_at: new Date(),
            })

            await newLP.save()
            newLPAdded.push({
                lpUrl: lpUrlVal,
                keyword: keywordVal,
                message: `Thêm landing page thành công`,
            })
        }

        return res.json(baseReturnJsonType(200, 'Thêm landing page bằng excel thành công', newLPAdded))
    } catch (err) {
        return res.json(baseReturnJsonType(1, 'Thêm landing page bằng excel thất bại. Vui lòng thử lại sau', null, err))
    }
}

async function update_landing_pages(req, res) {
    try {
        let errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.json({
                code: 1,
                message: processVal(errors)
            })
        }
        let { campaignID, kwName, lpURL } = req.body
        let { lp_id } = req.params

        kwName = kwName.toLowerCase()
        let filter = filterKWModelWithRole(res, { name: kwName })
        const kw = await keywordModel.findOne(filter)
        if (kw) {
            let filter1 = getFilterModelWithRole(res, { campaign: campaignID, main_kw: kw._id })
            let filter2 = getFilterModelWithRole(res, { campaign: campaignID, sub_kw: kw._id })
            const kwExistedInCampaign = await landingPageModel
                .findOne({ $or: [filter1, filter2] })
                .populate('main_kw')
                .populate('sub_kw')

            if (kwExistedInCampaign) {
                if (kwExistedInCampaign.main_kw.name === kwName && kwExistedInCampaign.url !== lpURL) {
                    return res.json({
                        code: 2,
                        message: `Từ khoá này đã tồn tại trong chiến dịch (LP: ${kwExistedInCampaign.url}). Vui lòng kiểm tra lại`,
                    })
                }
                kwExistedInCampaign.sub_kw.forEach((item) => {
                    if (item.name === kwName) {
                        return res.json({
                            code: 3,
                            message: `Từ khoá này đã tồn tại trong chiến dịch (LP: ${kwExistedInCampaign.url}). Vui lòng kiểm tra lại`,
                        })
                    }
                })
            }
        }

        let filter4 = getFilterModelWithRole(res, { campaign: campaignID, url: lpURL })
        const lPUrlExisted = await landingPageModel.findOne(filter4)
        if (lPUrlExisted && lPUrlExisted.url !== lpURL) {
            return res.json({
                code: 4,
                message: 'Landing page này đã tồn tại trong chiến dịch. Vui lòng kiểm tra lại',
            })
        }

        let kwObj = {
            name: kwName,
            updated_by: res.locals.user.user_id,
            created_at: new Date()
        }
        let result = await keywordModel.findOneAndUpdate({ name: kwName },
            { $set: kwObj }, { upsert: true, new: true })

        let editLP = {
            url: lpURL,
            main_kw: result._id,
        }

        const editLPResult = await landingPageModel.updateOne({ _id: lp_id }, { $set: editLP })
        // console.trace(editLPResult)
        if (editLPResult.modifiedCount !== 1) {
            return res.json({
                code: 5,
                message: 'Sửa landing page thất bại. Vui lòng thử lại sau',
            })
        }

        return res.json({
            code: 200,
            message: 'Chỉnh sửa landing page thành công'
        })
    } catch (err) {
        console.error(err)
        return res.json({
            code: 6,
            message: 'Xảy ra lỗi trong quá trình chỉnh sửa landing page. Vui lòng thử lại sau',
            error: err.message
        })
    }
}

async function lock_unlock_landing_pages(req, res) {
    let { lp_id } = req.params
    let { action } = req.body

    let isLock
    let msg
    switch (action) {
        case 'lock':
            isLock = true
            msg = 'Đóng'
            break
        case 'unlock':
            isLock = false
            msg = 'Mở'
            break
        default:
            return res.json({
                code: 1,
                message: 'Chỉ chấp nhận thao tác Đóng hoặc Mở landing page',
            })
    }

    try {
        let filter = getFilterModelWithRole(res, { _id: lp_id })
        const result = await landingPageModel.updateOne(filter, { $set: { isLock } })
        if (result.modifiedCount !== 1) {
            return res.json({
                code: 3,
                message: `Không tìm thấy landing page cần sửa. Vui lòng kiểm tra lại`
            })
        }

        return res.json({
            code: 200,
            message: `${msg} landing page thành công`
        })
    } catch (err) {
        console.trace(err)
        return res.json({
            code: 2,
            message: `${msg} landing page thất bại. Vui lòng thử lại sau`
        })
    }
}

async function get_lp_by_query_string(req, res) {
    let { keyword, campaigns } = req.query
    try {
        campaigns = campaigns.split(';')
        let campaignsID = []
        campaigns.forEach(campaign => {
            return campaignsID.push(mongoose.Types.ObjectId(campaign))
        })

        let filter = getFilterModelWithRole(res, { campaign: campaignsID, sub_kw: { $nin: keyword } })
        const lp = await landingPageModel.find(filter)

        return res.json({
            code: 200,
            message: 'Lấy Landing page theo chiến dịch thành công',
            data: lp
        })
    } catch (err) {
        console.trace(err)
        return res.json({
            code: 1,
            message: 'Lấy Landing page theo chiến dịch thất bại. Vui lòng thử lại sau',
            error: err.message
        })
    }
}

module.exports = {
    get_landing_pages,
    add_landing_pages,
    add_lp_by_excel,
    update_landing_pages,
    lock_unlock_landing_pages,
    get_lp_by_query_string
}

async function handle_campaign_id(req, res, campaign_id) {
    try {
        let filter = getFilterModelWithRole(res, { _id: campaign_id })
        let campaign = await campaignModel.findOne(filter)
        if (campaign === null) {
            return {
                code: 2,
                message: 'Chiến dịch không tồn tại. Vui lòng kiểm tra lại'
            }
        }

        return campaign
    } catch (err) {
        return {
            code: 1,
            message: 'Lấy ID Chiến dịch thất bại. Vui lòng thử lại sau',
            error: err
        }
    }
}