const express = require('express');

const routes = express.Router();
const passport = require('passport');
const playerController = require('../controller/player-controller');
const clubController = require('../controller/club-controller');
const matchController = require('../controller/match-controller');
const participationController = require('../controller/participation-controller');

routes.get('/', passport.authenticate('jwt', { session: false }), (req, res) => res.send('Hello, this is the API'));

/* Authentication endpoints */
routes.put('/players/:id', playerController.updatePlayer);
// routes.delete('/players/:id', playerController.deletePlayer);

// /* Club endpoints */
routes.get('/clubs/:id', clubController.getClub);
routes.get('/clubs/:id/players', playerController.getPlayersForClub); // ADMIN ENDPOINT
routes.post('/clubs/:id/players', playerController.addPlayerToClub); // ADMIN ENDPOINT
routes.post('/clubs', clubController.createClub);
routes.put('/clubs/:id', clubController.updateClub);
// routes.delete('/clubs/:id', clubController.deleteClub);

// /* Match endpoints */
routes.get('/clubs/:id/matches', matchController.getMatches); // NOT IN USE NOW
routes.post('/clubs/:id/matches', matchController.createMatch);
routes.put('/clubs/:id/matches/:matchId', matchController.updateMatch);
// routes.delete('clubs/:id/matches/:matchId', matchController.deleteMatch);

// /* Participation endpoints */
routes.get('/clubs/:id/matches/:matchId/participations/:playerId', participationController.getOwnParticipation);
routes.get('/clubs/:id/matches/:matchId/participations', participationController.getParticipations);
routes.post('/clubs/:id/matches/:matchId/participations', participationController.createParticipation);
routes.put('/clubs/:id/matches/:matchId/participations', participationController.updateParticipation);

// Following route might not required anymore if we do not join collections as initially intended
// routes.post('/participations', participationController.getParticipationsByPlayerId);

routes.get('/special', passport.authenticate('jwt', { session: false }), (req, res) => res.json({ msg: `Hey ${req.user.email}! You did it, you entered the place behind authorization! Congratulations!` }));

module.exports = routes;
