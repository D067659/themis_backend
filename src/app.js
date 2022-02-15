var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var cors = require('cors')
var passportMiddleware = require('./middleware/passport');
var protected_routes = require('./routes/protected_routes');
var public_routes = require('./routes/public_routes');
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    maxAge: 86400, // Set the browser cache time for preflight responses
    preflightContinue: true // Allow us to manually add to preflights
}));

// Add cache-control to preflight responses in a separate middleware:
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.end(); // No Vary required: cors sets it already set automatically
    } else { next(); }
});
app.use(passport.initialize());
passport.use(passportMiddleware);

app.use('/api', passport.authenticate('jwt', { session: false }), protected_routes);
app.use('/', public_routes);

const DB_URL = (process.env.NODE_ENV === 'test') ? process.env.DB_TEST_URL : process.env.DB_PROD_URL
mongoose.connect(DB_URL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDb database connection established sucessfully!');
});

connection.on('error', (err) => {
    console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
    process.exit();
})

module.exports = app;