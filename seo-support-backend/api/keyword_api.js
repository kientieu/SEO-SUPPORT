const { validationResult } = require('express-validator')
const fs = require('fs')
const readXlsxFile = require('read-excel-file/node')

const landingPageModel = require('../models/landing_page_model')
const keywordModel = require('../models/keyword_model')
const campaignModel = require('../models/campaign_model')
const postModel = require('../models/post_model')

const processVal = require('../library/process_validation_result')
const filterKWModelWithRole = require('../library/filter_keyword_model_with_role')
const getFilterModelWithRole = require('../library/get_filter_model_with_role')
const validateInputExcelFile = require('../library/validate_input_excel_file')
const baseReturnJsonType = require('../library/base_return_json_type')

const tempDataPath = './user_data/temp_data'

async function get_keyword_of_lp(req, res) {
    let { lp_id } = req.params

    try {
        let filter = getFilterModelWithRole(res, { _id: lp_id })
        const detailLP = await landingPageModel
            .findOne(filter)
            .populate({
                path: 'sub_kw',
                populate: ('updated_by')
            })
        // console.log(detailLP)
        res.json({
            code: 200,
            message: 'Lấy chi tiết landing page thành công',
            data: detailLP
        })
    } catch (err) {
        console.trace(err)
        return res.json({
            code: 1,
            message: 'Lấy chi tiết landing page thất bại. Vui lòng thử lại sau',
            error: err.message
        })
    }
}

async function add_keyword_of_lp(req, res) {
    let { lp_id } = req.params
    let { kwName } = req.body

    try {
        kwName = kwName.toLowerCase()
        let filter = filterKWModelWithRole(res, { name: kwName })
        const kwID = await keywordModel.findOne(filter)
            .select('_id')
        // console.log(kwID)

        let filter1 = getFilterModelWithRole(res, { _id: lp_id })
        const landingPages = await landingPageModel.findOne(filter1)

        let filter2 = getFilterModelWithRole(res, { campaign: landingPages.campaign, main_kw: kwID })
        let filter3 = getFilterModelWithRole(res, { campaign: landingPages.campaign, sub_kw: kwID })
        const kwExistedInCampaign = await landingPageModel.findOne({ $or: [filter2, filter3] })
        if (kwExistedInCampaign) {
            return res.json({
                code: 1,
                message: `Từ khoá này đã tồn tại trong chiến dịch (LP: ${kwExistedInCampaign.url})`,
            })
        }

        const kwObj = {
            name: kwName,
            updated_by: res.locals.user.user_id
        }
        let filter4 = filterKWModelWithRole(res, { name: kwName })
        const addOrUpdateKW = await keywordModel
            .findOneAndUpdate(filter4, { $set: kwObj, created_at: new Date() }, { upsert: true, new: true })
            .catch(err => {
                return res.json({
                    code: 2,
                    message: 'Đã xảy ra lỗi trong quá trình tạo từ khoá. Vui lòng thử lại sau',
                    error: err.message
                })
            })

        let filter5 = getFilterModelWithRole(res, { _id: lp_id })
        await landingPageModel.findOneAndUpdate(filter5, { $push: { sub_kw: addOrUpdateKW._id } })
            .catch((err) => {
                console.trace(err)
                return res.json({
                    code: 3,
                    message: 'Xảy ra lỗi trong quá trình thêm từ khoá. Vui lòng thử lại sau',
                    error: err.message
                })
            })

        return res.json({
            code: 200,
            message: 'Thêm từ khoá vào landing page thành công',
        })
    } catch (err) {
        console.error(err)
        return res.json({
            code: 4,
            message: 'Xảy ra lỗi trong quá trình thêm từ khoá vào landing page. Vui lòng thử lại sau',
            error: err.message
        })
    }
}

async function add_keyword_of_lp_by_excel(req, res) {
    try {
        const file = req.file
        const validate = validateInputExcelFile(file)
        if (validate.code !== 200) {
            return res.json(baseReturnJsonType(validate.code, validate.message))
        }

        const schema = {
            'TÊN TỪ KHOÁ': {
                // JSON object property name.
                prop: 'keyword',
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

        let newKeywordAdded = []
        let invalidName = /[~`!#$%^&*+=\-\\[\]';,/{}|":<>?]/g
        for (const row of rows) {
            let keyword = row.keyword
            let keywordVal = `Từ khoá: ${keyword}`
            if (!keyword) {
                continue
            }

            if (keyword.match(invalidName)) {
                newKeywordAdded.push({
                    keyword: keywordVal,
                    message: 'Từ khoá có chứa kí tự đặc biệt',
                })
                continue
            }

            let { lp_id } = req.params
            keyword = keyword.toLowerCase()
            let filter = filterKWModelWithRole(res, { name: keyword })
            const kwID = await keywordModel.findOne(filter)
                .select('_id')

            let filter1 = getFilterModelWithRole(res, { _id: lp_id })
            const landingPages = await landingPageModel.findOne(filter1)

            let filter2 = getFilterModelWithRole(res, { campaign: landingPages.campaign, main_kw: kwID })
            let filter3 = getFilterModelWithRole(res, { campaign: landingPages.campaign, sub_kw: kwID })
            const kwExistedInCampaign = await landingPageModel.findOne({ $or: [filter2, filter3] })
            if (kwExistedInCampaign) {
                newKeywordAdded.push({
                    keyword: keywordVal,
                    message: `Từ khoá đã tồn tại trong chiến dịch (LP: ${kwExistedInCampaign.url})`,
                })
                continue
            }

            const kwObj = {
                name: keyword,
                updated_by: res.locals.user.user_id
            }
            let filter4 = filterKWModelWithRole(res, { name: keyword })
            const addOrUpdateKW = await keywordModel
                .findOneAndUpdate(filter4, { $set: kwObj, created_at: new Date() }, { upsert: true, new: true })

            let filter5 = getFilterModelWithRole(res, { _id: lp_id })
            await landingPageModel.findOneAndUpdate(filter5, { $push: { sub_kw: addOrUpdateKW._id } })

            newKeywordAdded.push({
                keyword: keywordVal,
                message: `Thêm từ khoá thành công`,
            })
        }

        return res.json(baseReturnJsonType(200, 'Thêm từ khoá cho landing page bằng excel thành công', newKeywordAdded))
    } catch (err) {
        return res.json(baseReturnJsonType(1, 'Thêm từ khoá bằng cho landing page excel thất bại. Vui lòng thử lại sau', null, err))
    }
}

async function get_all_keywords(req, res) {
    let { kwSearch, sort, order } = req.query
    let keywords = null
    try {
        let baseFilter = kwSearch ? { name: new RegExp(kwSearch, 'i') } : {}
        let filter = filterKWModelWithRole(res, baseFilter)
        keywords = await keywordModel
            .find(filter)
            .sort(sort && order ? { [sort]: order } : {})
            .populate('updated_by')
    } catch (err) {
        console.trace(err)
        return res.json({
            code: 1,
            message: 'Lấy danh sách từ khoá theo giá trị thất bại. Vui lòng thử lại sau',
            error: err.message
        })
    }

    return res.json({
        code: 200,
        message: 'Lấy danh sách từ khoá thành công',
        data: keywords
    })
}

async function get_top_ten_keywords(req, res) {
    try {
        let filter = getFilterModelWithRole(res, {})
        let posts = await postModel.find(filter)
        let topTenKeywords = []
        for (const post of posts) {
            let existingKW = topTenKeywords.find(value => value.keyword.toString() === post.keyword.toString())
            if (!existingKW) {
                topTenKeywords.push({
                    keyword: post.keyword,
                    count: 1
                })
                continue
            }
            existingKW.count++
        }
        //Sort count by descending order
        topTenKeywords = topTenKeywords.sort((a, b) => {
            return parseInt(b.count) - parseInt(a.count)
        })
        //Get top 10 keywords
        if (topTenKeywords.length > 10) {
            topTenKeywords.length = 10
        }

        for (const element of topTenKeywords) {
            let keywordInfo = await keywordModel.findOne({ _id: element.keyword })
            if (keywordInfo) {
                element.keyword = keywordInfo
            }
        }

        return res.json({
            code: 200,
            message: 'Lấy danh sách 10 từ khoá được sử dụng nhiều nhất trong bài viết thành công',
            data: topTenKeywords
        })
    } catch (err) {
        console.error(err)
        return res.json({
            code: 1,
            message: 'Lấy danh sách 10 từ khoá được sử dụng nhiều nhất trong bài viết thất bại. Vui lòng thử lại sau',
            error: err.message
        })
    }
}

async function add_new_keyword(req, res) {
    try {
        let errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.json({
                code: 2,
                message: processVal(errors)
            })
        }
        let { keywordName, selectedLP } = req.body

        keywordName = keywordName.toLowerCase()
        let filter = filterKWModelWithRole(res, { name: keywordName })
        const keyword = await keywordModel.findOne(filter)
            .catch(err => {
                console.trace(err)
                return res.json({
                    code: 3,
                    message: 'Xảy ra lỗi trong quá trình tìm từ khoá. Vui lòng thử lại sau',
                    error: err.message
                })
            })
        if (keyword) {
            return res.json({
                code: 4,
                message: 'Từ khoá đã tồn tại. Vui lòng kiểm tra lại',
            })
        }

        const newKW = new keywordModel({
            name: keywordName,
            updated_by: res.locals.user.user_id,
            created_at: new Date()
        })
        let result = await newKW.save()
        // console.log(result)
        for (const landingPage of selectedLP) {
            let filter1 = getFilterModelWithRole(res, { _id: landingPage.value })
            await landingPageModel.findOneAndUpdate(filter1, { $push: { sub_kw: result._id } })
                .catch(err => {
                    console.trace(err)
                    return res.json({
                        code: 5,
                        message: 'Xảy ra lỗi trong quá trình thêm từ khoá vào landing pages. Vui lòng thử lại sau',
                        error: err.message
                    })
                })
        }

        return res.json({
            code: 200,
            message: 'Thêm từ khoá mới thành công',
        })
    } catch (err) {
        console.trace(err)
        return res.json({
            code: 1,
            message: 'Xảy ra lỗi trong quá trình thêm từ khoá mới. Vui lòng thử lại sau',
            error: err.message
        })
    }
}

async function add_keyword_by_excel(req, res) {
    try {
        const file = req.file
        const validate = validateInputExcelFile(file)
        if (validate.code !== 200) {
            return res.json(baseReturnJsonType(validate.code, validate.message))
        }

        const schema = {
            'TÊN TỪ KHOÁ': {
                // JSON object property name.
                prop: 'keyword',
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

        let newKeywordAdded = []
        let invalidName = /[~`!#$%^&*+=\-\\[\]';,/{}|":<>?]/g
        for (const row of rows) {
            let keyword = row.keyword
            let keywordVal = `Từ khoá: ${keyword}`
            if (!keyword) {
                continue
            }

            if (keyword.match(invalidName)) {
                newKeywordAdded.push({
                    keyword: keywordVal,
                    message: 'Từ khoá có chứa kí tự đặc biệt',
                })
                continue
            }

            keyword = keyword.toLowerCase()
            let filter = filterKWModelWithRole(res, { name: keyword })
            const keywordExisted = await keywordModel.findOne(filter)
            if (keywordExisted) {
                newKeywordAdded.push({
                    keyword: keywordVal,
                    message: 'Từ khoá đã tồn tại',
                })
                continue
            }

            const newKW = new keywordModel({
                name: keyword,
                updated_by: res.locals.user.user_id,
                created_at: new Date()
            })
            await newKW.save()
            newKeywordAdded.push({
                keyword: keywordVal,
                message: `Thêm từ khoá thành công`,
            })
        }

        return res.json(baseReturnJsonType(200, 'Thêm từ khoá bằng excel thành công', newKeywordAdded))
    } catch (err) {
        return res.json(baseReturnJsonType(1, 'Thêm từ khoá bằng excel thất bại. Vui lòng thử lại sau', null, err))
    }
}

async function get_keyword_details(req, res) {
    let { keyword_id } = req.params
    try {
        let filter = filterKWModelWithRole(res, { _id: keyword_id })
        const keyword = await keywordModel.findOne(filter)
            .populate('updated_by')
            .catch(err => {
                console.trace(err)
                return res.json({
                    code: 2,
                    message: 'Lấy chi tiết từ khoá thất bại. Vui lòng thử lại sau',
                    error: err.message
                })
            })

        let filter1 = getFilterModelWithRole(res, { $or: [{main_kw: keyword_id}, {sub_kw: keyword_id}] })
        const lpContainKW = await landingPageModel
            .find(filter1)
            .populate('campaign')
            .catch(err => {
                console.trace(err)
                return res.json({
                    code: 3,
                    message: 'Lấy landing page chứa từ khoá thất bại. Vui lòng thử lại sau',
                    error: err.message
                })
            })

        let campaignsIncludeKW = []
        lpContainKW.forEach(lp => {
            return campaignsIncludeKW.push(lp.campaign._id)
        })

        let filter2 = getFilterModelWithRole(res, { _id: { $nin: campaignsIncludeKW } })
        let campaignsOpt = await campaignModel.find(filter2)
            .catch(err => {
                console.trace(err)
                return res.json({
                    code: 4,
                    message: 'Lấy chiến dịch không chứa từ khoá thất bại. Vui lòng thử lại sau',
                    error: err.message
                })
            })

        return res.json({
            code: 200,
            message: 'Lấy chi tiết từ khoá thành công',
            data: {
                keyword,
                lpContainKW,
                campaignsOpt
            }
        })
    } catch (err) {
        console.trace(err)
        return res.json({
            code: 1,
            message: 'Lấy chi tiết từ khoá thất bại. Vui lòng thử lại sau',
            error: err.message
        })
    }
}

async function edit_keyword_details(req, res) {
    let { keyword_id } = req.params
    let { selectedLP } = req.body

    try {
        for (const landingPage of selectedLP) {
            let filter = getFilterModelWithRole(res, { _id: landingPage.value })
            const lp = await landingPageModel.findOne(filter)

            let filter1 = getFilterModelWithRole(res, { campaign: lp.campaign, main_kw: keyword_id })
            let filter2 = getFilterModelWithRole(res, { campaign: lp.campaign, sub_kw: keyword_id })
            const kwExistedInCampaign = await landingPageModel.findOne({ $or: [filter1, filter2] })
            if (!kwExistedInCampaign) {
                await landingPageModel.findOneAndUpdate(filter, { $push: { sub_kw: keyword_id } })
                    .catch(err => {
                        console.trace(err)
                        return res.json({
                            code: 2,
                            message: 'Xảy ra lỗi trong quá trình thêm từ khoá vào landing page. Vui lòng thử lại sau',
                            error: err.message
                        })
                    })
            }
        }

        return res.json({
            code: 200,
            message: 'Thêm từ khoá vào landing page thành công',
        })
    } catch (err) {
        console.trace(err)
        return res.json({
            code: 1,
            message: 'Thêm từ khoá vào landing page thất bại. Vui lòng thử lại sau',
            error: err.message
        })
    }
}

async function del_keyword_of_lp(req, res) {
    let { lp_id } = req.params
    let { kwId } = req.body

    try {
        let filter = filterKWModelWithRole(res, { _id: kwId })
        let keyword = await keywordModel.findOne(filter)
        if (!keyword) {
            return res.json({
                code: 2,
                message: 'Từ khoá không tồn tại. Vui lòng kiểm tra lại',
            })
        }

        let filter1 = getFilterModelWithRole(res, { keyword: keyword._id })
        let kwExistedInPost = await postModel.findOne(filter1)
        if (kwExistedInPost) {
            return res.json({
                code: 3,
                message: 'Không thể xoá từ khoá đã tồn tại trong bài viết',
            })
        }

        let filter2 = getFilterModelWithRole(res, { _id: lp_id })
        let result = await landingPageModel.findOneAndUpdate(filter2, { $pull: { sub_kw: kwId } })
        if (!result._id) {
            return res.json({
                code: 4,
                message: 'Landing page không tồn tại. Vui lòng kiểm tra lại',
            })
        }

        return res.json({
            code: 200,
            message: 'Xoá từ khoá của landing page thành công',
        })
    } catch (err) {
        console.error(err)
        return res.json({
            code: 1,
            message: 'Xảy ra lỗi trong quá trình xoá từ khoá của landing page. Vui lòng thử lại sau',
            error: err.message
        })
    }
}

async function del_lp_of_keyword(req, res) {
    let { keyword_id } = req.params
    let { lpId } = req.body

    try {
        let filter = filterKWModelWithRole(res, { _id: keyword_id })
        let keyword = await keywordModel.findOne(filter)
        if (!keyword) {
            return res.json({
                code: 2,
                message: 'Từ khoá không tồn tại. Vui lòng kiểm tra lại',
            })
        }

        let filter1 = getFilterModelWithRole(res, { keyword: keyword._id })
        let kwExistedInPost = await postModel.findOne(filter1)
        if (kwExistedInPost) {
            return res.json({
                code: 3,
                message: 'Không thể xoá từ khoá đã tồn tại trong bài viết',
            })
        }

        let filter2 = getFilterModelWithRole(res, { _id: lpId, main_kw: keyword_id })
        let isMainKWInLP = await landingPageModel.findOne(filter2)
        if (isMainKWInLP) {
            return res.json({
                code: 4,
                message: 'Không thể xoá từ khoá đầu tiên của landing page',
            })
        }

        let filter3 = getFilterModelWithRole(res, { _id: lpId })
        let result = await landingPageModel.findOneAndUpdate(filter3, { $pull: { sub_kw: keyword_id } })
        if (!result._id) {
            return res.json({
                code: 5,
                message: 'Landing page không tồn tại. Vui lòng kiểm tra lại',
            })
        }

        return res.json({
            code: 200,
            message: 'Xoá từ khoá của landing page thành công',
        })
    } catch (err) {
        console.error(err)
        return res.json({
            code: 1,
            message: 'Xảy ra lỗi trong quá trình xoá từ khoá của landing page. Vui lòng thử lại sau',
            error: err.message
        })
    }
}

module.exports = {
    get_keyword_of_lp,
    add_keyword_of_lp,
    add_keyword_of_lp_by_excel,
    get_all_keywords,
    get_top_ten_keywords,
    add_new_keyword,
    add_keyword_by_excel,
    get_keyword_details,
    edit_keyword_details,
    del_keyword_of_lp,
    del_lp_of_keyword,
}