const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const passport = require('passport');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');
const passportMiddleware = require('./middleware/passport');
const protectedRoutes = require('./routes/protected_routes');
const publicRoutes = require('./routes/public_routes');
const croneController = require('./controller/crone-controller');

const app = express();

// set up rate limiter: maximum of 60 requests per minute
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(passport.initialize());
passport.use(passportMiddleware);

app.use('/api', passport.authenticate('jwt', { session: false }), protectedRoutes);
app.use('/', publicRoutes);

const DB_URL = (process.env.NODE_ENV === 'test') ? process.env.DB_TEST_URL : process.env.DB_PROD_URL;
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const { connection } = mongoose;

connection.once('open', () => {
  console.log('MongoDb database connection established sucessfully!');
});

connection.on('error', (err) => {
  console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
  process.exit();
});

// Cron job to regularly delete outdated matches and participations
cron.schedule('59 23 * * 0', () => { // Runs every sunday at 23:59
  croneController.deleteOutdatedMatchesAndParticipations();
});

module.exports = app;
