const { Schema, model } = require('mongoose')
const userModel = require('./user_model')
const landingPageModel = require('./landing_page_model')
const keywordModel = require('./keyword_model')
const topicModel = require('./topic_model')

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    topic: {
        type: Schema.Types.ObjectId,
        ref: 'topic'
    },
    keyword: {
        type: Schema.Types.ObjectId,
        ref: 'keyword'
    },
    landing_page: {
        type: Schema.Types.ObjectId,
        ref: 'landingpage'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    origin_post: {
        type: Schema.Types.ObjectId,
        ref: 'post'
    },
    created_at: {
        type: Date
    },
    last_updated_at: {
        type: Date
    }
})

const user = model('user', userModel.schema)
const landingPage = model('landingpage', landingPageModel.schema)
const keyword = model('keyword', keywordModel.schema)
const topic = model('topic', topicModel.schema)
module.exports = model('post', postSchema)