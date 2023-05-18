const mongoose = require('mongoose')
const Schema = mongoose.Schema

const rtSchema = new Schema({
    chatid: {type: Number,},
    username: {type: String},
    refferer: {type: String},
    handle: {type: String},
    free: {type: Number, default: 5},
    paid: {type: Boolean, default: false},
    startDate: {type: Date},
    endDate: {type: Date}
}, {strict: false, timestamps: true })

const model = mongoose.model('rtbot-starter', rtSchema)
module.exports = model