const Club = require('../models/club');
const Player = require('../models/player');
const { isPlayerAdminOfClub, isPlayerInClub } = require('./validator')

exports.getClub = (req, res) => {
  if (!req.params.id) { return res.status(400).json({ msg: { message: 'You need to specify a club' } }); }

  Club.findById(req.params.id, (err, club) => {
    if (err) { return res.status(400).json({ msg: { message: err } }); }
    if (!club) { return res.status(400).json({ msg: { message: 'The club does not exist' } }); }

    if (!isPlayerInClub(req, res, club)) return res.status(400).json({ msg: { message: 'The club does not exist' } });

    return res.status(200).json(club);
  });
};

exports.createClub = (req, res) => {
  if (!req.body.name) { return res.status(400).json({ msg: { message: 'You need to provide a club name' } }); }

  Club.findOne({ name: { $eq: req.body.name } }, (err, club) => {
    if (err) { return res.status(400).json({ msg: { message: err } }); }
    if (club) { return res.status(400).json({ msg: { message: 'The club already exists' } }); }

    const newClub = Club(req.body);
    newClub.save((err, club) => {
      if (err) { return res.status(400).json({ msg: { message: err } }); }

      // Add club to player and set role to admin
      Player.findById(req.user._id, (err, player) => {
        if (err || !player) { return res.status(400).json({ msg: { message: err } }); }

        player.clubs.push({
          clubId: club._id,
          role: 'admin',
        });

        player.save((err) => {
          if (err) { return res.status(400).json({ msg: { message: err } }); }
        });
      });

      return res.status(201).json(club);
    });
  });
};

exports.updateClub = (req, res) => {
  if (!req.params.id) { return res.status(400).json({ msg: { message: 'You need to specify a club' } }); }

  Club.findById(req.params.id, (err, club) => {
    if (err) { return res.status(400).json({ msg: { message: err } }); }
    if (!club) { return res.status(400).json({ msg: { message: 'The club does not exist' } }); }

    if (!isPlayerAdminOfClub(req, res, club)) return res.status(400).json({ msg: { message: 'The club does not exist' } });

    club.name = req.body.name;
    club.invitationCode = req.body.invitationCode;

    club.save((err, club) => {
      if (err) { return res.status(400).json({ msg: { message: err } }); }

      return res.status(200).json(club);
    });
  });
};
