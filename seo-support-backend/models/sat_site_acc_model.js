const { Schema, model } = require('mongoose')
const siteDetailModel = require('./site_detail_model')
const userModel = require('./user_model')

const satSiteAccSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    site_detail: {
        type: Schema.Types.ObjectId,
        ref: 'sitedetail'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    created_at: {
        type: Date
    }
})

const siteDetail = model('sitedetail', siteDetailModel.schema)
const user = model('user', userModel.schema)
module.exports = model('satsiteacc', satSiteAccSchema)