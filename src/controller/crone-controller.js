const Match = require('../models/match');
// const Participation = require('../models/participation');

exports.deleteOutdatedMatchesAndParticipations = async () => {
    console.log('CRONE JOB RUNNING');
    const matches = await Match.find({ startDate: { $lte: Date.now() } });
    for (const match of matches) {
        await Match.deleteOne({ _id: match._id });
    }
    console.log('done removing deprecated matches. Delete count: ', matches.length);
};
