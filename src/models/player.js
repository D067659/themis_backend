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
    clubId: {
        type: ObjectId,
        required: true,
        trim: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        trim: true
    },
    fingerprintToken: {
        type: String,
        required: false,
        trim: true
    }
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