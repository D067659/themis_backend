var Participation = require('../models/participation');
var Club = require('../models/club');

exports.getParticipations = (req, res) => {
    if (!req.params.id || !req.params.matchId) {
        return res.status(400).json({ 'msg': { 'message': 'You need to specify a club, a player, and a match' } });
    }

    Participation.findOne({ playerId: req.user.id, clubId: req.params.id, matchId: req.params.matchId }, (err, participation) => {
        if (err) { return res.status(400).json({ 'msg': { 'message': err } }); }

        return res.status(200).json(participation);
    });
}

exports.createParticipation = (req, res) => {
    if (!req.params.id || !req.params.matchId) { return res.status(400).json({ 'msg': 'You need to provide a club and a match' }); }

    Club.findById(req.params.id, (err, club) => {
        if (err) { return res.status(400).json({ 'msg': { 'message': err } }); }
        if (!club) { return res.status(400).json({ 'msg': { 'message': 'The club does not exist' } }); }

        // Check if user belongs to questioned club in DB
        const clubFound = req.user.clubs.find(userClub => userClub.clubId == club.id);
        if (!clubFound || clubFound.role !== 'admin') { return res.status(400).json({ 'msg': { 'message': 'The club does not exist' } }); }

        let newParticipation = Participation(req.body);
        newParticipation.save((err, participation) => {
            if (err) { return res.status(400).json({ 'msg': err }); }

            return res.status(201).json(participation);
        });
    });
}

exports.updateParticipation = (req, res) => {
    if (!req.params.id || !req.params.matchId) { return res.status(400).json({ 'msg': 'You need to specify a club, a match, and a participation' }); }
    Participation.findOneAndUpdate({ clubId: req.params.id, matchId: req.params.matchId, playerId: req.user.id }, req.body, { upsert: true, new: true, runValidators: true })
        .then((updatedStatus) => {
            res.json(updatedStatus);
        })
        .catch((err) => {
            res.send(err);
        });
};


exports.updateParticipationX = (req, res) => {
    if (!req.params.id || !req.params.matchId) { return res.status(400).json({ 'msg': 'You need to specify a club, a match, and a participation' }); }

    Participation.findOne({ clubId: req.params.id, matchId: req.params.matchId, playerId: req.user.id },
        (err, participation) => {
            if (err) { return res.status(400).json({ 'msg': err }); }
            if (!participation) { return res.status(400).json({ 'msg': 'The participation does not exist' }); }

            participation.hasTime = req.body.hasTime

            participation.save((err, participation) => {
                if (err) { return res.status(400).json({ 'msg': err }); }

                return res.status(200).json(participation);
            });
        });
}

// exports.getParticipationsByPlayerId = (req, res) => {
//     if (!req.body.playerId) { return res.status(400).json({ 'msg': 'You need to provide a player id' }); }

//     Participation.aggregate([
//         {
//             $match: { playerId: ObjectId('5e62706adba1b65a54a21a41') }
//         },
//         {
//             $lookup: {
//                 from: "matches",
//                 localField: "matchId",    // field in the orders collection
//                 foreignField: "_id",  // field in the items collection
//                 as: "fromMatch"
//             }
//         },
//         {
//             $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$fromMatch", 0] }, "$$ROOT"] } }
//         },
//         { $project: { fromMatch: 0 } }
//     ], (err, response) => {
//         if (err) { return res.status(500).json(err) }

//         return res.status(200).json(response)
//     });
// }