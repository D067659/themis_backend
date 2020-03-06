var Player    = require('../models/player');
var jwt     = require('jsonwebtoken');
var config  = require('../config/config');

function createToken(player) {
    return jwt.sign({ id: player.id, email: player.email }, config.jwtSecret, {
        expiresIn: 20
    });
}

exports.registerPlayer = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ 'msg': 'You need to send email and password' });
    }

    Player.findOne({ email: req.body.email }, (err, player) => {
        if (err) {
            return res.status(400).json({ 'msg': err});
        }

        if (player) {
            return res.status(400).json({ 'msg': 'The player already exists' });
        }

        let newPlayer = Player(req.body);
        newPlayer.save((err, player) => {
            if (err) {
                return res.status(400).json({ 'msg': err })
            }
            return res.status(201).json(player);
        });
    });
}

exports.loginPlayer = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ 'msg': 'You need to send email and password' });
    }

    Player.findOne({ email: req.body.email }, (err, player) => {
        if (err) {
            return res.status(400).json({ 'msg': err});
        }

        if (!player) {
            return res.status(400).json({ 'msg': 'The player does not exist' });
        }

        Player.comparePassword(req.body.password, (err, isMatch) => {
            if (isMatch && !err) {
                return res.status(200).json({
                    token: createToken(player)
                });
            } else {
                return res.status(400).json({ 'msg': 'The email and password dont match.'});
            }
        })
    });
}