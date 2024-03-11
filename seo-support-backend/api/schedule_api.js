const { validationResult } = require('express-validator')
const cronJob = require('cron').CronJob
const axios = require('axios')
const { BASE_URL, ACCESS_TOKEN_SECRET } = process.env
const jwt = require('jsonwebtoken')

const scheduleModel = require('../models/schedule_model')
const satSiteModel = require('../models/sat_site_model')

const processVal = require('../library/process_validation_result')
const returnJson = require('../library/json_type')
const latinizeString = require('../library/latinize_string')
const getFilterModelWithRole = require('../library/get_filter_model_with_role')

let scheduleList = []
let isScheduleJobRunning = false

async function get_schedules(req, res) {
    let schedules = null
    try {
        let filter = getFilterModelWithRole(res, {})
        schedules = await scheduleModel
            .find(filter)
            .populate('site_acc_info')
            .populate('post_info')

        return returnJson(res, 200, 'Lấy danh sách lập lịch thành công', schedules)
    } catch (err) {
        return returnJson(res, 1, 'Xảy ra lỗi trong quá trình lấy danh sách lập lịch. Vui lòng thử lại sau', null, err)
    }
}

async function get_auto_schedules(req, res) {
    let schedules = null
    try {
        let filter = getFilterModelWithRole(res, { post_type: 'Auto' })
        schedules = await scheduleModel
            .find(filter)
            .populate('site_acc_info')
            .populate('post_info')

        return returnJson(res, 200, 'Lấy danh sách lập lịch tự động thành công', schedules)
    } catch (err) {
        return returnJson(res, 1, 'Xảy ra lỗi trong quá trình lấy danh sách lập lịch tự động. Vui lòng thử lại sau', null, err)
    }
}

async function get_manual_schedules(req, res) {
    try {
        let filter = getFilterModelWithRole(res, { post_type: 'Manual' })
        let manualSchedules = await scheduleModel
            .find(filter)
            .populate('sat_site')
            .populate('site_acc_info')
            .populate('post_info')
            .populate('author', 'name')

        return returnJson(res, 200, 'Lấy danh sách kết quả đăng thủ công thành công', manualSchedules)
    } catch (err) {
        return returnJson(res, 1, 'Xảy ra lỗi trong quá trình lấy danh sách kết quả đăng thủ công. Vui lòng thử lại sau', null, err)
    }
}

async function get_schedule_details(req, res) {
    const { schedule_id } = req.params
    try {
        let filter = getFilterModelWithRole(res, { _id: schedule_id })
        let resultDetails = await scheduleModel
            .findOne(filter)
            .populate('author', '-_id -password')
            .populate('sat_site')
            .populate({
                path: 'site_acc_info',
                populate: {
                    path: 'site_detail'
                }
            })
            .populate('post_info')

        return returnJson(res, 200, 'Lấy chi tiết kết quả thành công', resultDetails)
    } catch (err) {
        return returnJson(res, 1, 'Xảy ra lỗi trong quá trình lấy chi tiết kết quả tự động. Vui lòng thử lại sau', null, err)
    }
}

async function add_to_auto_schedule(req, res) {
    let { schDate, satSiteId, siteAccId, postId, acceptSiteLv3, acceptTranslate } = req.body

    try {
        schDate = new Date(schDate)
        let now = new Date()
        if (schDate - now < 0) {
            return returnJson(res, 1, 'Thời gian lập lịch phải trễ hơn thời gian hiện tại')
        }

        let status = 'Đang thực hiện'
        const newSch = new scheduleModel({
            post_type: 'Auto',
            date: schDate,
            author: res.locals.user.user_id,
            status,
            sat_site: satSiteId,
            site_acc_info: siteAccId,
            post_info: postId,
            accept_site_lv3: acceptSiteLv3,
            accept_translate: acceptTranslate,
        })

        const addSchResult = await newSch.save()
        let newSchId = null
        if (addSchResult) {
            newSchId = addSchResult._id
        }
        return returnJson(res, 200, 'Thêm dữ liệu lập lịch tự động thành công', newSchId)
    } catch (err) {
        return returnJson(res, 2, 'Xảy ra lỗi trong quá trình thêm dữ liệu lập lịch tự động. Vui lòng thử lại sau', null, err)
    }
}

async function cancel_auto_schedule(req, res) {
    let { schedule_id } = req.params
    try {
        await scheduleModel.findByIdAndUpdate(schedule_id, { status: 'Đã huỷ' })
        return returnJson(res, 200, 'Huỷ lập lịch tự động thành công')
    } catch (err) {
        return returnJson(res, 1, 'Xảy ra lỗi trong quá trình cập nhật dữ liệu lập lịch tự động. Vui lòng thử lại sau', null, err)
    }
}

async function get_data_for_scheduler() {
    try {
        let now = new Date()
        now.setHours(now.getHours())
        now.setMinutes(now.getMinutes())
        now.setSeconds(0)
        now.setMilliseconds(0)
        scheduleList = await scheduleModel
            .find({ status: { $regex: new RegExp('Đang thực hiện', 'i') }, date: { $eq: now } })
            .sort({ date: 'asc' })
            .populate('sat_site')
            .populate('site_acc_info')
            .populate('post_info')
            .populate('author', '_id role')
        console.log('Schedule list:', scheduleList.map((schedule) => schedule._id))
        return {
            code: 200,
            message: 'Lấy data cho lập lịch thành công'
        }
    } catch (err) {
        return {
            message: 'Xảy ra lỗi trong quá trình lấy dữ liệu lập lịch. Vui lòng thử lại sau',
            error: err
        }
    }
}

async function start_auto_schedule(req, res) {
    try {
        if (!scheduleList.length) {
            return returnJson(res, 200, `Không có lập lịch cần chạy`)
        }
        while (scheduleList.length) {
            isScheduleJobRunning = true
            //Case: time has passed after post_to_site runs
            let scheduleId = scheduleList[0]._id
            let payload = {
                scheduleId,
                satSiteId: scheduleList[0].sat_site._id,
                siteAccId: scheduleList[0].site_acc_info._id,
                postId: scheduleList[0].post_info._id,
                acceptSiteLv3: scheduleList[0].accept_site_lv3,
                acceptTranslate: scheduleList[0].accept_translate,
            }
            let whichSite = scheduleList[0].sat_site.name
            whichSite = whichSite.replace(/\s/g, '')
            whichSite = whichSite.toLowerCase()
            whichSite = latinizeString.latinize(whichSite)
            let siteLevel = scheduleList[0].sat_site.level
            console.info(`Schedule job prepares to run at ${new Date().toLocaleString()}:`, scheduleId)

            jwt.sign({
                user_id: scheduleList[0].author._id,
                user_role: scheduleList[0].author.role,
            }, ACCESS_TOKEN_SECRET, {
                expiresIn: 60
            }, async (err, token) => {
                if (err) {
                    return returnJson(res, 2, 'Xảy ra lỗi trong quá trình lập lịch tự động. Vui lòng thử lại sau', null, err)
                }

                await axios.post(`${BASE_URL}/api/sat-sites/post-to?site=${whichSite}&level=${siteLevel}`, payload, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
            })
            // console.info(response.data)
            scheduleList.splice(0, 1)
        }
    } catch (err) {
        return returnJson(res, 1, 'Xảy ra lỗi trong quá trình lập lịch tự động. Vui lòng thử lại sau', null, err)
    }
    isScheduleJobRunning = false
}

//Trigger schedule job every 15 minutes
const runScheduleJobEvery15Mins = new cronJob({
    cronTime: '*/15 * * * *',
    onTick: async () => {
        await get_data_and_run_schedule()
    },
    timeZone: 'Asia/Ho_Chi_Minh'
})
runScheduleJobEvery15Mins.start()

async function call_start_schedule_api() {
    try {
        const response = await axios.get(`${BASE_URL}/api/schedules/auto/start`)
        console.info(response.data)
    } catch (err) {
        console.error(err)
    }
}

async function get_data_and_run_schedule() {
    const result = await get_data_for_scheduler()
    if (result.code !== 200) {
        console.error(result.message, result.error)
        return
    }
    if (!isScheduleJobRunning) {
        return call_start_schedule_api()
    }
    checkScheduleJobRunning.start()
}

const checkScheduleJobRunning = new cronJob({
    cronTime: '* * * * *',
    onTick: async () => {
        if (!isScheduleJobRunning) {
            await call_start_schedule_api()
        }
        else {
            checkScheduleJobRunning.stop()
        }
    },
    timeZone: 'Asia/Ho_Chi_Minh'
})

async function count_posts_of_site(req, res) {
    let satSites = null
    try {
        satSites = await satSiteModel.find()
    } catch (err) {
        return returnJson(res, 1, 'Lấy danh sách site vệ tinh thất bại. Vui lòng thử lại sau', null, err)
    }
    let data = {}
    for (const satSite of satSites) {
        try {
            let filter = getFilterModelWithRole(res, { sat_site: satSite._id })
            data[`${satSite._id}`] = await scheduleModel.countDocuments(filter)
        } catch (err) {
            return returnJson(res, 2, 'Lấy danh sách lập lịch theo site vệ tinh thất bại. Vui lòng thử lại sau', null, err)
        }
    }
    return returnJson(res, 200, 'Lấy số lượng bài viết được đăng theo site vệ tinh thành công', data)
}

module.exports = {
    get_schedules,
    get_auto_schedules,
    get_manual_schedules,
    get_schedule_details,
    add_to_auto_schedule,
    start_auto_schedule,
    cancel_auto_schedule,
    count_posts_of_site
}
