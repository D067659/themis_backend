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
        trim: true,
        immutable: true
    },
    opponent: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true,
        min: Date.now()
    },
    isHome: {
        type: Boolean,
        required: true
    },
    meetingPoint: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Match', MatchSchema)