var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ParticipationSchema = new mongoose.Schema({

    playerId: {
        type: ObjectId,
        required: true,
        trim: true,
        unique: true,
        immutable: true
    },
    clubId: {
        type: ObjectId,
        required: true,
        trim: true,
        unique: false,
        immutable: true
    },
    matchId: {
        type: ObjectId,
        required: true,
        trim: true,
        unique: false,
        immutable: true
    },
    hasTime: {
        type: Boolean,
        trim: true,
        unique: false
    }
})

ParticipationSchema.index({ playerId: 1, matchId: 1 }, { unique: true })


module.exports = mongoose.model('Participation', ParticipationSchema)