var Player = require('../models/player');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

module.exports = new JwtStrategy(opts, function (jwt_payload, done) {
    Player.findById(jwt_payload.id, function (err, player) {
        if (err) {
            return done(err, false);
        }
        if (player) {
            return done(null, player);
        } else {
            return done(null, false)
        }
    })
})