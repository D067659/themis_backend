const mongoose = require('mongoose');
const ParticipationSchema = require('./participation');

const { Schema } = mongoose;
const { ObjectId } = Schema;
const MatchSchema = new mongoose.Schema({

  city: {
    type: String,
    required: true,
    trim: true,
  },
  clubId: {
    type: ObjectId,
    required: true,
    trim: true,
    immutable: true,
  },
  opponent: {
    type: String,
    required: true,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
    min: Date.now(),
  },
  isHome: {
    type: Boolean,
    required: true,
  },
  meetingPoint: {
    type: String,
    required: true,
  },
});

MatchSchema.pre('deleteOne', async function (next) {
  console.log('Pre-hook to delete all participations');
  const participations = await ParticipationSchema.deleteMany({ matchId: this._conditions._id });
  console.log('done removing deprecated participations. Delete count: ', participations.deletedCount);
  next();
});

module.exports = mongoose.model('Match', MatchSchema);
