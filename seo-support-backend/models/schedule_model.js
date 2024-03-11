const { Schema, model } = require('mongoose')
const satSiteModel = require('./sat_site_model')
const satSiteAccModel = require('./sat_site_acc_model')
const postModel = require('./post_model')
const userModel = require('./user_model')

const scheduleSchema = new Schema({
    post_type: { //2 types: "Manual", "Auto"
        type: String
    },
    date: {
        type: Date,
        require: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    status: { //4 types: "Thành công", "Thất bại", "Đang thực hiện", "Đã huỷ"
        type: String
    },
    result: {
        type: String
    },
    sat_site: {
        type: Schema.Types.ObjectId,
        ref: 'satsite'
    },
    site_acc_info: {
        type: Schema.Types.ObjectId,
        ref: 'satsiteacc'
    },
    post_info: {
        type: Schema.Types.ObjectId,
        ref: 'post'
    },
    accept_site_lv3: {
        type: Boolean
    },
    accept_translate: {
        type: Boolean
    },
})

const satSite = model('satsite', satSiteModel.schema)
const satSiteAcc = model('satsiteacc', satSiteAccModel.schema)
const post = model('post', postModel.schema)
const user = model('user', userModel.schema)
module.exports = model('schedule', scheduleSchema)