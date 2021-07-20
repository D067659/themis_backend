var Participation = require('../models/participation');
var Club = require('../models/club');

exports.getParticipations = (req, res) => {
    if (!req.params.id || !req.params.playerId || req.params.playerId !== req.user.id) { return res.status(400).json({ 'msg': 'You need to specify a club and a player' }); }

    Participation.find({ playerId: req.user.id }, (err, participations) => {
        if (err) { return res.status(400).json({ 'msg': err }); }

        let relevantParticipations = [];
        if (participations.length > 0) {
            // Filter on participations in provided club
            relevantParticipations = participations.find(p => p.clubId == req.params.id);
        }

        return res.status(200).json(relevantParticipations);
    });
}

exports.createParticipation = (req, res) => {
    if (!req.params.id || !req.params.matchId) { return res.status(400).json({ 'msg': 'You need to provide a club and a match' }); }

    Club.findById(req.params.id, (err, club) => {
        if (err) { return res.status(400).json({ 'msg': err }); }
        if (!club) { return res.status(400).json({ 'msg': 'The club does not exist' }); }

        // Check if user belongs to questioned club in DB
        const clubFound = req.user.clubs.find(userClub => userClub.clubId == club.id);
        if (!clubFound || clubFound.role !== 'admin') { return res.status(400).json({ 'msg': 'The club does not exist' }); }

        let newParticipation = Participation(req.body);
        newParticipation.save((err, participation) => {
            if (err) { return res.status(400).json({ 'msg': err }); }

            return res.status(201).json(participation);
        });
    });
}

exports.updateParticipation = (req, res) => {
    if (!req.params.id || !req.params.matchId || !req.params.participationId) { return res.status(400).json({ 'msg': 'You need to specify a club, a match, and a participation' }); }

    Participation.findOne({ clubId: req.params.id, matchId: req.params.matchId, playerId: req.user.id, _id: req.params.participationId },
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