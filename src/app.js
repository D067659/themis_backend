const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const passport = require('passport');
const cors = require('cors');
const RateLimit = require('express-rate-limit');
const passportMiddleware = require('./middleware/passport');
const protected_routes = require('./routes/protected_routes');
const public_routes = require('./routes/public_routes');

const app = express();

// set up rate limiter: maximum of 60 requests per minute
const limiter = new RateLimit({
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

app.use('/api', passport.authenticate('jwt', { session: false }), protected_routes);
app.use('/', public_routes);

const DB_URL = (process.env.NODE_ENV === 'test') ? process.env.DB_TEST_URL : process.env.DB_PROD_URL;
mongoose.connect(DB_URL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const { connection } = mongoose;

connection.once('open', () => {
  console.log('MongoDb database connection established sucessfully!');
});

connection.on('error', (err) => {
  console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
  process.exit();
});

module.exports = app;
