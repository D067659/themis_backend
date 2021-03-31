var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var config = require('./config/config');
var port = process.env.PORT || 5000;

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
var passportMiddleware = require('./middleware/passport');
passport.use(passportMiddleware);

app.post('/', function (req, res) {
    return res.send('API is at http://localhost:' + port + '/api');
});

var protected_routes = require('./routes/protected_routes');
var public_routes = require('./routes/public_routes');

app.use('/api', passport.authenticate('jwt', { session: false }), protected_routes);
app.use('/', public_routes);

mongoose.connect(config.db, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDb database connection established sucessfully!');
});

connection.on('error', (err) => {
    console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
    process.exit();
})

app.listen(port);
console.log('App is up and running at http://localhost:' + port)