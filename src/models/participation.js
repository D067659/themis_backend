const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema;

const ParticipationSchema = new mongoose.Schema({

  playerId: {
    type: ObjectId,
    required: true,
    trim: true,
    unique: false,
    immutable: true,
  },
  clubId: {
    type: ObjectId,
    required: true,
    trim: true,
    unique: false,
    immutable: true,
  },
  matchId: {
    type: ObjectId,
    required: true,
    trim: true,
    unique: false,
    immutable: true,
  },
  hasTime: {
    type: Boolean,
    trim: true,
    unique: false,
    default: null,
  },
});

ParticipationSchema.index({ playerId: 1, matchId: 1 }, { unique: true });

module.exports = mongoose.model('Participation', ParticipationSchema);
