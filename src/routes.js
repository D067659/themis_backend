var express         = require('express'),
    routes          = express.Router();
var userController  = require('./controller/user-controler');
var passport        = require('passport')

routes.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.send('Hello, this is the API');
});

routes.post('/register', userController.registerUser);
routes.post('/login', userController.loginUser);

routes.get('/special', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({msg: `Hey ${req.user.email}! You did it, you entered the place behind authorization! Congratulations!`});
});

module.exports = routes;