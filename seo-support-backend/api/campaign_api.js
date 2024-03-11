const { validationResult } = require('express-validator')
const fs = require('fs')
const readXlsxFile = require('read-excel-file/node')

const campaignModel = require('../models/campaign_model')
const landingPageModel = require('../models/landing_page_model')

const processVal = require('../library/process_validation_result')
const getFilterModelWithRole = require('../library/get_filter_model_with_role')
const baseReturnJsonType = require('../library/base_return_json_type')
const validateInputExcelFile = require('../library/validate_input_excel_file')

const tempDataPath = './user_data/temp_data'

async function get_campaigns(req, res) {
    try {
        let filter = getFilterModelWithRole(res, { isLock: { $ne: true } })
        let campaigns = await campaignModel.find(filter)
            .populate('author')

        return res.json({
            code: 200,
            message: 'Lấy danh sách chiến dịch thành công',
            data: campaigns,
        })
    } catch (err) {
        console.trace(err)
        return res.json({
            code: 1,
            message: 'Lấy danh sách chiến dịch thất bại. Vui lòng thử lại sau',
            error: err.message,
        })
    }
}

async function add_campaign(req, res) {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json({
            code: 1,
            message: processVal(errors)
        })
    }
    let { campaignName, campaignUrl } = req.body
    if (campaignUrl.charAt(campaignUrl.length - 1) === '/') {
        campaignUrl = campaignUrl.slice(0, -1)
    }
    let filter = getFilterModelWithRole(res, { 'name': { $regex: new RegExp('^'+ campaignName + '$', 'i') } })
    let campaignExisted = await campaignModel.findOne(filter)
    if (campaignExisted) {
        return res.json({
            code: 2,
            message: 'Chiến dịch đã tồn tại. Vui lòng kiểm tra lại',
        })
    }

    const newCampaign = new campaignModel({
        name: campaignName,
        url: campaignUrl,
        author: res.locals.user.user_id,
        created_at: new Date()
    })
    await newCampaign.save(err => {
        if (err) {
            return res.json({
                code: 2,
                message: 'Đã xảy ra lỗi trong quá trình tạo chiến dịch. Vui lòng thử lại sau',
                error: err.message
            })
        }
        return res.json({
            code: 200,
            message: 'Tạo chiến dịch thành công'
        })
    })
}

async function add_campaign_by_excel(req, res) {
    try {
        const file = req.file
        const validate = validateInputExcelFile(file)
        if (validate.code !== 200) {
            return res.json(baseReturnJsonType(validate.code, validate.message))
        }

        const schema = {
            'TÊN CHIẾN DỊCH': {
                // JSON object property name.
                prop: 'campaignName',
                type: String,
                // required: true,
            },
            'URL': {
                prop: 'campaignUrl',
                type: String,
                // required: true,
            },
        }

        const { rows, errors } = await readXlsxFile(fs.createReadStream(`${tempDataPath}/${file.filename}`), { schema })
        if (errors.length) {
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

        let newCampaignAdded = []
        let invalidPattern = /[~`!#$%^&*+=\-\\[\]';,/{}|":<>?]/g
        let validUrl = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$', 'i')
        for (const row of rows) {
            let campaignName = row.campaignName
            let campaignUrl = row.campaignUrl
            let campaignNameVal = `Tên chiến dịch: ${campaignName}`
            let campaignUrlVal = `URL: ${campaignUrl}`
            if (!campaignName) {
                newCampaignAdded.push({
                    campaignUrl: campaignUrlVal,
                    message: 'Thiếu tên chiến dịch',
                })
                continue
            }
            if (!campaignUrl) {
                newCampaignAdded.push({
                    campaignName: campaignNameVal,
                    message: 'Thiếu chiến dịch url',
                })
                continue
            }

            if (campaignName.match(invalidPattern)) {
                newCampaignAdded.push({
                    campaignName: campaignNameVal,
                    campaignUrl: campaignUrlVal,
                    message: 'Tên chiến dịch có chứa kí tự đặc biệt',
                })
                continue
            }

            if (!campaignUrl.match(validUrl)) {
                newCampaignAdded.push({
                    campaignName: campaignNameVal,
                    campaignUrl: campaignUrlVal,
                    message: 'Sai định dạng url cho chiến dịch',
                })
                continue
            }

            let filter = getFilterModelWithRole(res, { 'name': { $regex: new RegExp('^'+ campaignName + '$', 'i') } })
            let campaignExisted = await campaignModel.findOne(filter)
            if (campaignExisted) {
                newCampaignAdded.push({
                    campaignName: campaignNameVal,
                    campaignUrl: campaignUrlVal,
                    message: 'Chiến dịch đã tồn tại',
                })
                continue
            }

            let newCampaign = new campaignModel({
                name: campaignName,
                url: campaignUrl,
                author: res.locals.user.user_id,
                created_at: new Date(),
            })
            await newCampaign.save()
            newCampaignAdded.push({
                campaignName: campaignNameVal,
                campaignUrl: campaignUrlVal,
                message: `Thêm chiến dịch thành công`,
            })
        }

        return res.json(baseReturnJsonType(200, 'Thêm chiến dịch bằng excel thành công', newCampaignAdded))
    } catch (err) {
        return res.json(baseReturnJsonType(1, 'Thêm chiến dịch bằng excel thất bại. Vui lòng thử lại sau', null, err))
    }
}

async function edit_campaign(req, res) {
    try {
        let errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.json({
                code: 1,
                message: processVal(errors)
            })
        }
        let { campaignName, campaignUrl } = req.body
        let { campaign_id } = req.params
        const newCampaign = {
            name: campaignName,
            url: campaignUrl
        }

        let filter = getFilterModelWithRole(res, { _id: campaign_id })
        let result = await campaignModel.updateOne(filter, { $set: newCampaign })
        if (result.modifiedCount !== 1) {
            return res.json({
                code: 3,
                message: 'Không tồn tại chiến dịch cần sửa. Vui lòng thử lại sau',
            })
        }

        return res.json({
            code: 200,
            message: 'Sửa chiến dịch thành công'
        })
    } catch (err) {
        console.trace(err)
        return res.json({
            code: 2,
            message: 'Xảy ra lỗi trong quá trình sửa chiến dịch. Vui lòng thử lại sau',
            error: err.message
        })
    }
}

async function lock_unlock_campaign(req, res) {
    let { campaign_id } = req.params
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
                message: 'Chỉ chấp nhận thao tác Đóng hoặc Mở chiến dịch',
            })
    }
    try {
        let filter = getFilterModelWithRole(res, { _id: campaign_id })
        const resultLockCampaign = await campaignModel.updateOne(filter, { $set: { isLock } })
        if (resultLockCampaign.modifiedCount !== 1) {
            return res.json({
                code: 3,
                message: `${msg} chiến dịch thất bại. Vui lòng thử lại sau`,
            })
        }

        let filter1 = getFilterModelWithRole(res, { campaign: campaign_id })
        await landingPageModel.updateMany(filter1, { $set: { isLock } })

        return res.json({
            code: 200,
            message: `${msg} chiến dịch thành công`,
        })
    } catch (err) {
        console.trace(err)
        return res.json({
            code: 2,
            message: `${msg} chiến dịch thất bại. Vui lòng thử lại sau`,
            error: err.message
        })
    }
}

async function get_closed_campaign(req, res) {
    try {
        let filter = getFilterModelWithRole(res, { isLock: true })
        let closedCampaigns = await campaignModel.find(filter)
            .populate('author')

        res.json({
            code: 200,
            message: 'Lấy danh sách chiến dịch đã đóng thành công',
            data: closedCampaigns
        })
    } catch (err) {
        console.trace(err)
        return res.json({
            code: 1,
            message: 'Lấy danh sách chiến dịch đã đóng thất bại. Vui lòng thử lại sau',
            error: err.message
        })
    }
}

module.exports = {
    get_campaigns,
    get_closed_campaign,
    add_campaign,
    add_campaign_by_excel,
    edit_campaign,
    lock_unlock_campaign
}