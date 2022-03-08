const Participation = require('../models/participation');
const Club = require('../models/club');

exports.getOwnParticipation = (req, res) => {
  if (!req.params.id || !req.params.matchId || req.params.playerId !== req.user.id) {
    return res.status(400).json({ msg: { message: 'You need to specify a club, a player, and a match' } });
  }

  Participation.findOne({ playerId: req.user.id, clubId: req.params.id, matchId: req.params.matchId }, (err, participation) => {
    if (err) { return res.status(400).json({ msg: { message: err } }); }

    return res.status(200).json(participation);
  });
};

exports.getParticipations = (req, res) => {
  if (!req.params.id || !req.params.matchId) {
    return res.status(400).json({ msg: { message: 'You need to specify a club and a match' } });
  }

  Club.findById(req.params.id, (err, club) => {
    if (err) { return res.status(400).json({ msg: { message: err } }); }
    if (!club) { return res.status(400).json({ msg: { message: 'The club does not exist' } }); }

    // Check if user belongs to questioned club in DB
    const clubFound = req.user.clubs.find((userClub) => userClub.clubId.toString() === club.id);
    if (!clubFound || clubFound.role !== 'admin') { return res.status(400).json({ msg: { message: 'The club does not exist' } }); }

    Participation.find({ clubId: req.params.id, matchId: req.params.matchId },
      (err, participation) => {
        if (err) { return res.status(400).json({ msg: { message: err } }); }

        return res.status(200).json(participation);
      });
  });
};

exports.createParticipation = (req, res) => {
  if (!req.params.id || !req.params.matchId) { return res.status(400).json({ msg: { message: 'You need to provide a club and a match' } }); }

  Club.findById(req.params.id, (err, club) => {
    if (err) { return res.status(400).json({ msg: { message: err } }); }
    if (!club) { return res.status(400).json({ msg: { message: 'The club does not exist' } }); }

    // Check if user belongs to questioned club in DB
    const clubFound = req.user.clubs.find((userClub) => userClub.clubId.toString() === club.id);
    if (!clubFound || clubFound.role !== 'admin') { return res.status(400).json({ msg: { message: 'The club does not exist' } }); }

    const newParticipation = Participation(req.body);
    newParticipation.save((err, participation) => {
      if (err) { return res.status(400).json({ msg: { message: err } }); }

      return res.status(201).json(participation);
    });
  });
};

exports.updateParticipation = (req, res) => {
  if (!req.params.id || !req.params.matchId) { return res.status(400).json({ msg: { message: 'You need to specify a club, a match, and a participation' } }); }

  const updateParticipation = {
    clubId: req.body.clubId,
    matchId: req.body.matchId,
    hasTime: req.body.hasTime,
  };

  Participation.findOneAndUpdate({
    clubId: req.params.id,
    matchId: req.params.matchId,
    playerId: req.user.id
  }, updateParticipation, { upsert: true, new: true, runValidators: true })
    .then((updatedStatus) => {
      res.json(updatedStatus);
    })
    .catch((err) => {
      res.send(err);
    });
};
