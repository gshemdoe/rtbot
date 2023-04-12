const mongoose = require('mongoose')
const Schema = mongoose.Schema

const rtSchema = new Schema({
    chatid: {
        type: Number,
    },
    username: {
        type: String
    },
    refferer: {
        type: String
    },
    handle: {
        type: String
    }
}, {strict: false, timestamps: true })

const model = mongoose.model('rtbot-starter', rtSchema)
module.exports = model