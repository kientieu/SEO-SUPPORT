const { Schema, model } = require('mongoose')
const satSiteModel = require('./sat_site_model')
const userModel = require('./user_model')

const siteDetailSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    params: {
        type: String
    },
    site: {
        type: Schema.Types.ObjectId,
        ref: 'satsite'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
})

const satSite = model('satsite', satSiteModel.schema)
const user = model('user', userModel.schema)
module.exports = model('sitedetail', siteDetailSchema)