/* eslint-disable max-len */
const jwt = require('jsonwebtoken');
const Player = require('../models/player');
const nodemailer = require('../config/nodemailer.config');

function getExpireHours() {
  return 10;
}

function createToken(player) {
  return jwt.sign({ id: player.id, email: player.email }, process.env.JWT_SECRET, {
    expiresIn: `${getExpireHours()}h`,
  });
}

function createConfirmationCode() {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
}

exports.createPlayer = (req, res) => {
  if (!req.body.email || !req.body.password) { return res.status(400).json({ msg: { message: 'You need to send email and password' } }); }

  Player.findOne({ email: { $eq: req.body.email } }, (err, player) => {
    if (err) { return res.status(400).json({ msg: { message: err } }); }

    if (player) { return res.status(400).json({ msg: { message: 'The player already exists' } }); }

    const newPlayer = Player(req.body);
    newPlayer.save((err, player) => {
      if (err) { return res.status(400).json({ msg: { message: err } }); }

      return res.status(201).json(player);
    });
  });
};

exports.loginPlayer = (req, res) => {
  if (!req.body.email || !req.body.password) { return res.status(400).json({ msg: { message: 'You need to send email and password' } }); }

  Player.findOne({ email: { $eq: req.body.email } }, (err, player) => {
    if (err) { return res.status(400).json({ msg: { message: err } }); }

    if (!player) { return res.status(400).json({ msg: { message: 'The player does not exist' } }); }

    if (player.status !== 'active') { return res.status(401).json({ msg: { message: 'Registration pending. Please verify your email' } }); }

    // create a user a new user
    const user = new Player(player);

    // compare passwords
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (isMatch && !err) {
        // do not populate password in response
        delete user._doc.password;
        return res.status(200).json({
          ...user._doc,
          token: createToken(player),
          expiresInHours: getExpireHours(),
        });
      }
      return res.status(400).json({ msg: { message: 'The email and password dont match' } });
    });
  });
};

exports.updatePlayer = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ msg: { message: 'You need to send email and password' } });
  }

  if (req.user.id !== req.params.id) { return res.status(400).json({ msg: { message: 'You can only change your own personal profile' } }); }

  Player.findById(req.params.id, (err, player) => {
    if (err) { return res.status(400).json({ msg: { message: err } }); }

    if (!player) { return res.status(400).json({ msg: { message: 'No player was found' } }); }

    player.email = req.body.email;
    player.password = req.body.password;
    player.name = req.body.name;
    player.clubId = req.body.clubId;

    player.save((err, player) => {
      if (err) { return res.status(400).json({ msg: { message: err } }); }

      // do not populate password in response
      player.password = undefined;

      return res.status(200).json(player);
    });
  });
};

exports.getPlayersForClub = (req, res) => {
  if (!req.params.id) { return res.status(400).json({ msg: { message: 'You need to specify a club' } }); }

  Player.find({ 'clubs.clubId': req.params.id }, (err, players) => {
    if (err) { return res.status(400).json({ msg: { message: err } }); }
    if (!players) { return res.status(400).json({ msg: { message: 'The club does not exist' } }); }

    // Mongoose type to JS object for deleting password
    players = players.map((p) => p.toObject());
    players.forEach((p) => { delete p.password; });

    // Check if user belongs to questioned club in DB
    const clubFound = req.user.clubs.find((userClub) => userClub.clubId.toString() === req.params.id);
    if (!clubFound || clubFound.role !== 'admin') { return res.status(400).json({ msg: { message: 'No players exist' } }); }

    return res.status(200).json(players);
  });
};

exports.checkPlayerData = async (req, res) => {
  if (!req.params.clubId || !req.params.confirmationCode) { return res.status(400).json({ msg: { message: 'You need to provide a club and confirmation code' } }); }

  const player = await Player.findOne({ confirmationCode: req.params.confirmationCode });
  if (player) { // no registration, only add to club
    delete player.password;
    return res.status(200).json(player);
  } // promt user to register
  return res.status(400).json({ msg: { message: 'No player found for the given confirmation code' } });
};

exports.confirmClubMembership = async (req, res) => {
  if (!req.params.clubId || !req.params.confirmationCode) { return res.status(400).json({ msg: { message: 'You need to provide a club and confirmation code' } }); }

  const player = await Player.findOne({ confirmationCode: req.params.confirmationCode });
  if (player) { // no registration, only add to club
    const clubFound = player.clubs.find((userClub) => userClub.clubId.toString() === req.params.clubId);
    if (clubFound) { return res.status(400).json({ msg: { message: 'You are already a member of this club' } }); }
    player.clubs.push({ clubId: req.params.clubId, role: 'member' });
    player.status = 'active';
    if (req.body.email) { player.email = req.body.email; }
    if (req.body.name) { player.name = req.body.name; }
    if (req.body.password) { player.password = req.body.password; }
    await player.save();
    delete player.password;
    return res.status(200).json(player);
  }
  return res.status(400).json({ msg: { message: 'No player found for the given confirmation code' } });
};

exports.addPlayerToClub = async (req, res) => {
  if (!req.params.id || !req.body.clubName || !req.body.receiverName || !req.body.receiverEmail) { return res.status(400).json({ msg: { message: 'You need to specify proper information' } }); }

  // Check if user belongs to questioned club in DB
  const clubFound = req.user.clubs.find((userClub) => userClub.clubId.toString() === req.params.id);
  if (!clubFound || clubFound.role !== 'admin') { return res.status(400).json({ msg: { message: 'No club exist' } }); }

  let player = await Player.findOne({ email: { $eq: req.body.receiverEmail } });
  const confirmationCode = createConfirmationCode();
  console.log('player found (addPlayerToClub): ', player);
  if (!player) {
    player = await Player.create({ confirmationCode });
  } else {
    const partOfClub = player.clubs.find((userClub) => userClub.clubId.toString() === req.params.id);
    if (partOfClub) { return res.status(400).json({ msg: { message: 'Player already member of club' } }); }
    player.confirmationCode = confirmationCode;
  }
  await player.save();
  player = player.toObject();
  delete player.password;

  nodemailer.sendConfirmationEmail(
    req.user.name,
    req.params.id,
    req.body.clubName,
    req.body.receiverName,
    req.body.receiverEmail,
    confirmationCode,
  );
  return res.status(201).json({ player });
};

exports.removePlayerFromClub = async (req, res) => {
  if (!req.params.id || !req.params.playerId) { return res.status(400).json({ msg: { message: 'You need to specify a club ID and player ID' } }); }

  // Check if user belongs to questioned club in DB
  const clubFound = req.user.clubs.find((userClub) => userClub.clubId.toString() === req.params.id);
  if (!clubFound || clubFound.role !== 'admin') { return res.status(400).json({ msg: { message: 'No club exist' } }); }

  let playerToDelete = await Player.findById(req.params.playerId);

  if (!playerToDelete) { return res.status(400).json({ msg: { message: 'The player does not exist' } }); }

  playerToDelete.clubs = playerToDelete.clubs.filter((el) => el.clubId.toString() !== req.params.id);
  playerToDelete.save();

  return res.status(202).json({ status: 'removed' });
};
