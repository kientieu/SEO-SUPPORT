const express = require('express')
const router = express.Router()
const { body } = require('express-validator')

const scheduleApi = require('../api/schedule_api')

const checkLogin = require('../middleware/check_login')


router.get('/schedules', checkLogin, scheduleApi.get_schedules)

router.get('/schedules/auto', checkLogin, scheduleApi.get_auto_schedules)

router.get('/schedules/manual', checkLogin, scheduleApi.get_manual_schedules)

router.get('/schedule-detail/auto/:schedule_id', checkLogin, scheduleApi.get_schedule_details)

router.post('/schedules/auto', checkLogin, scheduleApi.add_to_auto_schedule)

router.post('/schedules/auto/cancel/:schedule_id', checkLogin, scheduleApi.cancel_auto_schedule)

router.get('/schedules/auto/start', scheduleApi.start_auto_schedule)

router.get('/schedules/count-posts-of-site', checkLogin, scheduleApi.count_posts_of_site)

module.exports = router;
