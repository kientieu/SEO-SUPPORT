const { validationResult } = require('express-validator')

const topicModel = require('../models/topic_model')

const processVal = require('../library/process_validation_result')
const returnJson = require('../library/json_type')

async function get_topics(req, res) {
    try {
        const topics = await topicModel.find()

        returnJson(res, 200, 'Lấy danh sách chủ đề thành công', topics)
    } catch (err) {
        returnJson(res, 1, 'Lấy danh sách chủ đề thất bại. Vui lòng thử lại sau', null, err)
    }
}

async function add_new_topic(req, res) {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        returnJson(res, 1, processVal(errors))
    }

}

module.exports = {
    get_topics,
    add_new_topic
}
