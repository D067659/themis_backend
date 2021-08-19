var Club = require('../models/club');
var Player = require('../models/player');

exports.getClub = (req, res) => {
    if (!req.params.id) { return res.status(400).json({ 'msg': { 'message': 'You need to specify a club' } }); }

    Club.findById(req.params.id, (err, club) => {
        if (err) { return res.status(400).json({ 'msg': { 'message': err } }); }
        if (!club) { return res.status(400).json({ 'msg': { 'message': 'The club does not exist' } }); }

        // Check if user belongs to questioned club in DB
        const clubFound = req.user.clubs.find(userClub => userClub.clubId == club.id);
        if (!clubFound) { return res.status(400).json({ 'msg': { 'message': 'The club does not exist' } }); }

        return res.status(200).json(club);
    });
}

exports.createClub = (req, res) => {
    if (!req.body.name) { return res.status(400).json({ 'msg': { 'message': 'You need to provide a club name' } }); }

    Club.findOne({ name: req.body.name }, (err, club) => {
        if (err) { return res.status(400).json({ 'msg': { 'message': err } }); }

        if (club) { return res.status(400).json({ 'msg': { 'message': 'The club already exists' } }); }

        let newClub = Club(req.body);
        newClub.save((err, club) => {
            if (err) { return res.status(400).json({ 'msg': { 'message': err } }); }
            // Add club to player and set role to admin
            Player.findById(req.user._id, (err, player) => {
                if (err || !player) { return res.status(400).json({ 'msg': { 'message': err } }); }


                player.clubs.push({
                    clubId: club._id,
                    role: 'admin'
                })

                player.save((err) => {
                    if (err) { return res.status(400).json({ 'msg': { 'message': err } }); }
                });
            });

            return res.status(201).json(club);
        });
    });
}

exports.updateClub = (req, res) => {
    if (!req.params.id) { return res.status(400).json({ 'msg': { 'message': 'You need to specify a club' } }); }

    Club.findById(req.params.id, (err, club) => {
        if (err) { return res.status(400).json({ 'msg': { 'message': err } }); }
        if (!club) { return res.status(400).json({ 'msg': { 'message': 'The club does not exist' } }); }

        // Check if user belongs to questioned club in DB
        const clubFound = req.user.clubs.find(userClub => userClub.clubId == club.id);
        if (!clubFound || clubFound.role !== 'admin') { return res.status(400).json({ 'msg': { 'message': 'The club does not exist' } }); }

        club.name = req.body.name;
        club.invitationCode = req.body.invitationCode;

        club.save((err, club) => {
            if (err) { return res.status(400).json({ 'msg': { 'message': err } }); }

            return res.status(200).json(club);
        });
    });
}