var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var MatchSchema = new mongoose.Schema({

    city: {
        type: String,
        required: true,
        trim: true
    },
    clubId: {
        type: ObjectId,
        required: true,
        trim: true
    },
    opponent: {
        type: String,
        required: true,
        trim: true
    },
    startTime: {
        type: String,
        required: false,
        trim: true
    }
})

module.exports = mongoose.model('Match', MatchSchema)