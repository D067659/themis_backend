require('dotenv').config({ path: '../.env' })
const app = require('./app');
const port = 5000;
app.listen(port);