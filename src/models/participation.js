var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var ParticipationSchema = new mongoose.Schema({

    playerId: {
        type: ObjectId,
        required: true,
        trim: true
    },
    matchId: {
        type: ObjectId,
        required: true,
        trim: true
    },
    hasTime: {
        type: Boolean,
        trim: true
    }
})

module.exports = mongoose.model('Participation', ParticipationSchema)