const mongoose = require('mongoose');

const ClubSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true,
  },
  invitationCode: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model('Club', ClubSchema);
