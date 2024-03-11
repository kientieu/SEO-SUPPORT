const { Schema, model } = require('mongoose')
const userModel = require('./user_model')

const topicSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    updated_by: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
})

const user = model('user', userModel.schema)
module.exports = model('topic', topicSchema)