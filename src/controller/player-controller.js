var Player = require('../models/player');
var jwt = require('jsonwebtoken');

function createToken(player) {
    return jwt.sign({ id: player.id, email: player.email }, process.env.JWT_SECRET, {
        expiresIn: "10h"
    });
}

exports.createPlayer = (req, res) => {
    if (!req.body.email || !req.body.password) { return res.status(400).json({ 'msg': { 'message': 'You need to send email and password' } }); }

    Player.findOne({ email: req.body.email }, (err, player) => {
        if (err) { return res.status(400).json({ 'msg': { 'message': err } }); }

        if (player) { return res.status(400).json({ 'msg': { 'message': 'The player already exists' } }); }

        let newPlayer = Player(req.body);
        newPlayer.save((err, player) => {
            if (err) { return res.status(400).json({ 'msg': { 'message': err } }); }

            return res.status(201).json(player);
        });
    });
}

exports.loginPlayer = (req, res) => {
    if (!req.body.email || !req.body.password) { return res.status(400).json({ 'msg': { 'message': 'You need to send email and password' } }); }

    Player.findOne({ email: req.body.email }, (err, player) => {
        if (err) { return res.status(400).json({ 'msg': { 'message': err } }); }

        if (!player) { return res.status(400).json({ 'msg': { 'message': 'The player does not exist' } }); }

        // create a user a new user
        var user = new Player(player);

        // compare passwords
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (isMatch && !err) {
                // do not populate password in response
                delete user._doc.password;
                return res.status(200).json({
                    ...user._doc,
                    token: createToken(player)
                });
            } else {
                return res.status(400).json({ 'msg': { 'message': 'The email and password dont match' } });
            }
        })
    });
}

exports.updatePlayer = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ 'msg': { 'message': 'You need to send email and password' } });
    }

    if (req.user.id !== req.params.id) { return res.status(400).json({ 'msg': { 'message': 'You can only change your own personal profile' } }); }

    Player.findById(req.params.id, (err, player) => {
        if (err) { return res.status(400).json({ 'msg': { 'message': err } }); }

        if (!player) { return res.status(400).json({ 'msg': { 'message': 'No player was found' } }); }

        player.email = req.body.email;
        player.password = req.body.password;
        player.name = req.body.name;
        player.clubId = req.body.clubId;;

        player.save((err, player) => {
            if (err) { return res.status(400).json({ 'msg': { 'message': err } }); }

            // do not populate password in response
            player.password = undefined;

            return res.status(200).json(player);
        });
    });
}