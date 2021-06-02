var Club = require('../models/club');
var Player = require('../models/player');

exports.createClub = (req, res) => {
    console.log('user: ', req.user)
    if (!req.body.name) {
        return res.status(400).json({ 'msg': 'You need to provide a club name' });
    }

    Club.findOne({ name: req.body.name }, (err, club) => {
        if (err) {
            return res.status(400).json({ 'msg': err });
        }

        if (club) {
            return res.status(400).json({ 'msg': 'The club already exists' });
        }

        let newClub = Club(req.body);
        newClub.save((err, club) => {
            if (err) {
                return res.status(400).json({ 'msg': err })
            }
            // Add club to player and set role to admin
            Player.findById(req.user._id, (err, player) => {
                if (err || !player) {
                    return res.status(400).json({ 'msg': err });
                }
                player.clubs.push({
                    clubId: club._id,
                    role: 'admin'
                })

                player.save((err) => {
                    if (err) {
                        return res.status(400).json({ 'msg': err })
                    }
                });
            });

            return res.status(201).json(club);
        });
    });
}

exports.getClub = (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ 'msg': 'You need to specify a club' });
    }

    Club.findOne({ id: req.params.id }, (err, club) => {
        if (err) {
            return res.status(400).json({ 'msg': err });
        }

        if (!club || !req.user.clubId.includes(club.id)) {
            return res.status(400).json({ 'msg': 'The club does not exist' });
        }

    });
}