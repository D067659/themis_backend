require('dotenv').config({ path: '../.env' })
const app = require('./app');
const port = process.env.PORT;
var express = require('express');
var cors = require('cors');
var app = express();

app.use(cors())
app.listen(port);