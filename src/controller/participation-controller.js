var Participation = require('../models/participation');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

exports.createParticipation = (req, res) => {
    if (!req.body.playerId) {
        return res.status(400).json({ 'msg': 'You need to provide a player id' });
    }

    let newParticipation = Participation(req.body);
    newParticipation.save((err, participation) => {
        if (err) { return res.status(400).json({ 'msg': err }); }

        return res.status(201).json(participation);
    });
}

exports.getParticipationsByPlayerId = (req, res) => {
    if (!req.body.playerId) { return res.status(400).json({ 'msg': 'You need to provide a player id' }); }

    Participation.aggregate([
        {
            $match: { playerId: ObjectId('5e62706adba1b65a54a21a41') }
        },
        {
            $lookup: {
                from: "matches",
                localField: "matchId",    // field in the orders collection
                foreignField: "_id",  // field in the items collection
                as: "fromMatch"
            }
        },
        {
            $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$fromMatch", 0] }, "$$ROOT"] } }
        },
        { $project: { fromMatch: 0 } }
    ], (err, response) => {
        if (err) { return res.status(500).json(err) }

        return res.status(200).json(response)
    });


}