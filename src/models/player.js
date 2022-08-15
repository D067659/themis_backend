const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;
const { ObjectId } = Schema;

const PlayerSchema = new mongoose.Schema({

  email: {
    type: String,
    unique: false,
    required: false,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: false,
    trim: true,
  },
  name: {
    type: String,
    unique: false,
    required: false,
    trim: true,
  },
  clubs: [{
    _id: false,
    clubId: {
      type: ObjectId,
      required: false, // Without clubId role cannot be set
      trim: true,
    },
    role: {
      type: String,
      required: false, // Without clubId role cannot be set
      trim: true,
    },
  }],
  status: {
    type: String,
    enum: ['pending', 'active'],
    default: 'pending',
  },
  confirmationCode: {
    type: String,
    unique: true,
    required: true,
  },

});

PlayerSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('password') || (!user.password)) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

PlayerSchema.methods.comparePassword = function (candiatePassword, cb) {
  bcrypt.compare(candiatePassword, this.password, (err, res) => {
    if (err) return cb(err);

    cb(null, res);
  });
};

module.exports = mongoose.model('Player', PlayerSchema);
