require('dotenv').config({ path: '../.env' })
const app = require('./app');
const port = process.env.PORT;
app.listen(port);
console.log('Backend running on port ', port);