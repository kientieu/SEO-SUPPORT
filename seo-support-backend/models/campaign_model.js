const { Schema, model } = require('mongoose')
const userModel = require('./user_model')

const campaignSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    created_at: {
        type: Date
    },
    isLock: {
        type: Boolean
    }
})

const user = model('user', userModel.schema)
module.exports = model('campaign', campaignSchema)