const { Schema, model } = require('mongoose')

const satSiteSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    has_api: {
        type: Boolean
    },
    params: {
        type: String
    },
    level: { // Currently, 2 levels: 2, 3
        type: Number
    },
})

module.exports = model('satsite', satSiteSchema)