var mongoose = require('mongoose');

var ClubSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    invitationCode: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    }
})

module.exports = mongoose.model('Club', ClubSchema)