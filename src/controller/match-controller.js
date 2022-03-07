const Match = require('../models/match');
const Club = require('../models/club');

exports.getMatches = (req, res) => {
  if (!req.params.id) { return res.status(400).json({ msg: { message: 'You need to specify a club' } }); }

  Match.find({ clubId: req.params.id, startDate: { $gte: Date.now() } }, (err, matches) => {
    if (err) { return res.status(400).json({ msg: { message: err } }); }

    // Check if user belongs to the club for the very first questioned match in DB
    const clubFound = req.user.clubs.find((userClub) => userClub.clubId == req.params.id);
    if (!clubFound) { return res.status(400).json({ msg: { message: 'The matches do not exist' } }); }

    return res.status(200).json(matches);
  }).sort({ startDate: 'ascending' });
};

exports.createMatch = (req, res) => {
  if (!req.params.id) { return res.status(400).json({ msg: { message: 'You need to specify a club' } }); }

  Club.findById(req.params.id, (err, club) => {
    if (err) { return res.status(400).json({ msg: { message: err } }); }
    if (!club) { return res.status(400).json({ msg: { message: 'The club does not exist' } }); }

    // Check if user belongs to questioned club in DB
    const clubFound = req.user.clubs.find((userClub) => userClub.clubId == club.id);
    if (!clubFound || clubFound.role !== 'admin') { return res.status(400).json({ msg: { message: 'The club does not exist' } }); }

    const newMatch = Match(req.body);
    newMatch.save((err, match) => {
      if (err) { return res.status(400).json({ msg: { message: err } }); }

      return res.status(201).json(match);
    });
  });
};

exports.updateMatch = (req, res) => {
  if (!req.params.id || !req.params.matchId) { return res.status(400).json({ msg: { message: 'You need to specify a club and a match' } }); }

  Club.findById(req.params.id, (err, club) => {
    if (err) { return res.status(400).json({ msg: { message: err } }); }
    if (!club) { return res.status(400).json({ msg: { message: 'The club does not exist' } }); }

    // Check if user belongs to questioned club in DB
    const clubFound = req.user.clubs.find((userClub) => userClub.clubId == club.id);
    if (!clubFound || clubFound.role !== 'admin') { return res.status(400).json({ msg: { message: 'The club does not exist' } }); }

    // Check if provided match id exists
    Match.findById(req.params.matchId, (err, match) => {
      if (err) { return res.status(400).json({ msg: { message: err } }); }
      if (!match || (match.clubId != club.id)) { return res.status(400).json({ msg: { message: 'The match does not exist' } }); }

      match.city = req.body.city;
      match.opponent = req.body.opponent;
      match.startDate = req.body.startDate;
      match.isHome = req.body.isHome;
      match.meetingPoint = req.body.meetingPoint;

      match.save((err, match) => {
        if (err) { return res.status(400).json({ msg: { message: err } }); }

        return res.status(200).json(match);
      });
    });
  });
};
