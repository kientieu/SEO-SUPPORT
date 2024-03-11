const mongoose = require('mongoose')
const { DB_URL } = process.env

const mongodb = {
    connect: () => {
        mongoose.connect(
            DB_URL,
            { useNewUrlParser: true, useUnifiedTopology: true }
        ).then(() => console.log('☁ Database connected'))
            .catch((error) => console.log('❌ Database connect error', error.message))
        mongoose.Promise = global.Promise
    },
    disconnect: async () => {
        Object.keys(mongoose.connection.models).forEach(key => {
            delete mongoose.connection.models[key]
        })
        await mongoose.disconnect()
    }
}

module.exports = mongodb