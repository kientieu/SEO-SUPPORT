const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String
    },
    role: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    bank_account: {
        type: String
    },
    phone: {
        type: String
    }
})

module.exports = model('user', userSchema)