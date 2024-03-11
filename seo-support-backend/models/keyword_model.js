const { Schema, model } = require('mongoose')
const userModel = require('./user_model')

const keywordSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    updated_by: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    created_at: {
        type: Date
    }
})

const user = model('user', userModel.schema)
module.exports = model('keyword', keywordSchema)