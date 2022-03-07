const Player = require('../models/player');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

module.exports = new JwtStrategy(opts, ((jwt_payload, done) => {
  Player.findById(jwt_payload.id, (err, player) => {
    if (err) {
      return done(err, false);
    }
    if (player) {
      return done(null, player);
    }
    return done(null, false);
  });
}));
