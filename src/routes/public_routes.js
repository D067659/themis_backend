var express = require('express');
var routes = express.Router();
var playerController = require('../controller/player-controller');

/* Authentication endpoints */
routes.post('/login', playerController.loginPlayer);
routes.post('/register', playerController.createPlayer);
routes.get('/clubs/:clubId/confirm/:confirmationCode', playerController.checkPlayerData);
routes.post('/clubs/:clubId/confirm/:confirmationCode', playerController.confirmClubMembership);

routes.get('/health', (req, res) => {
    res.send('App is up and running!')
})

module.exports = routes;