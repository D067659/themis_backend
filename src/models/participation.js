var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var ParticipationSchema = new mongoose.Schema({

    playerId: {
        type: ObjectId,
        required: true,
        trim: true,
        unique: true
    },
    clubId: {
        type: ObjectId,
        required: true,
        trim: true,
        unique: false
    },
    matchId: {
        type: ObjectId,
        required: true,
        trim: true,
        unique: false
    },
    hasTime: {
        type: Boolean,
        trim: true,
        unique: false
    }
})

ParticipationSchema.index({ playerId: 1, matchId: 1 }, { unique: true })


module.exports = mongoose.model('Participation', ParticipationSchema)