const mongoose = require('mongoose')
const Schema = mongoose.Schema

const channelsSchema = new Schema({
    ch_id: {
        type: Number,
    },
    ch_title: {
        type: String
    }
}, {strict: false, timestamps: true })

const model = mongoose.model('my_bongo_channels', channelsSchema)
module.exports = model