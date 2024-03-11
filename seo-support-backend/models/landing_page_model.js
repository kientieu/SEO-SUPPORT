const { Schema, model } = require('mongoose')
const userModel = require('./user_model')
const campaignModel = require('./campaign_model')
const keywordModel = require('./keyword_model')

const landingPageSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    campaign: {
        type: Schema.Types.ObjectId,
        ref: 'campaign'
    },
    main_kw: {
        type: Schema.Types.ObjectId,
        ref: 'keyword'
    },
    sub_kw: [{
        type: Schema.Types.ObjectId,
        ref: 'keyword'
    }],
    created_at: {
        type: Date
    },
    isLock: {
        type: Boolean
    }
})

const user = model('user', userModel.schema)
const campaign = model('campaign', campaignModel.schema)
const keyword = model('keyword', keywordModel.schema)
module.exports = model('landingpage', landingPageSchema)