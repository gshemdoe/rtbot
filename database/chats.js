const mongoose = require('mongoose')
const Schema = mongoose.Schema

const rtSchema = new Schema({
    chatid: {type: Number,},
    username: {type: String},
    refferer: {type: String},
    handle: {type: String},
    free: {type: Number, default: 5},
    points: {type: Number, default: 500},
    paid: {type: Boolean, default: false},
    payHistory: {type: Array},
    malipo: {type: Object}
}, {strict: false, timestamps: true })

const model = mongoose.model('rtbot-starter', rtSchema)
module.exports = model