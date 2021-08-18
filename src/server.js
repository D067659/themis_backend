require('dotenv').config({ path: '../.env' })
console.log('hi', process.env.PORT)
const app = require('./app');
const port = process.env.PORT || 5000;
app.listen(port);
console.log('App is up and running at http://localhost:' + port)