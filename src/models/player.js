var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var PlayerSchema = new mongoose.Schema({

    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        unique: false,
        required: true,
        trim: true
    },
    clubs: [{
        _id: false,
        clubId: {
            type: ObjectId,
            required: false, // Without clubId role cannot be set
            trim: true
        },
        role: {
            type: String,
            required: false, // Without clubId role cannot be set
            trim: true
        }
    }],


})

PlayerSchema.pre('save', function (next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        })
    })
})

PlayerSchema.methods.comparePassword = function (candiatePassword, cb) {
    bcrypt.compare(candiatePassword, this.password, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch);
    })
}

module.exports = mongoose.model('Player', PlayerSchema)