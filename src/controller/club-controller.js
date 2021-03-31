var Club = require('../models/club');

exports.createClub = (req, res) => {
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
            return res.status(201).json(club);
        });
    });
}