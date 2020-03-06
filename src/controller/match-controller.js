var Match = require('../models/match');

exports.registerMatch = (req, res) => {
    if (!req.body.clubId) {
        return res.status(400).json({ 'msg': 'You need to provide a club id' });
    }

    let newMatch = Match(req.body);
    newMatch.save((err, match) => {
        if (err) {
            return res.status(400).json({ 'msg': err })
        }
        return res.status(201).json(match);
    });

}