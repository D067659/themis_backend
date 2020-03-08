var express         = require('express'),
    routes          = express.Router();
var playerController  = require('./controller/player-controler');
var clubController  = require('./controller/club-controller');
var matchController  = require('./controller/match-controller');
var participationController  = require('./controller/participation-controller');

var passport        = require('passport')

routes.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.send('Hello, this is the API');
});

routes.post('/registerPlayer', playerController.registerPlayer);
routes.post('/login', playerController.loginPlayer);
routes.post('/registerClub', clubController.registerClub);
routes.post('/registerMatch', matchController.registerMatch);
routes.post('/registerParticipation', participationController.registerParticipation);
routes.post('/participations', participationController.getParticipationsByPlayerId);


routes.get('/special', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({msg: `Hey ${req.user.email}! You did it, you entered the place behind authorization! Congratulations!`});
});

module.exports = routes;