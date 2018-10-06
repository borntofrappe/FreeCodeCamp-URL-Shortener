// set up an express app
const port = 3000;
const express = require('express');
const app = express();
// require the dotenv library to access local `.env` variables
require('dotenv').config();

// render the stylesheet as found in the public folder
app.use(express.static(`${__dirname}/public`));

// in the root path render the HTML file found in the views folder
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// in the selected path render temporarily a default response
app.get('/api/shorturl', function (req, res) {
  res.json({
    "message": "this is a test",
    "no kidding": "the app is being developed"
  });
});

// listen in the selected port and render the simple application
app.listen(port);
console.log(`listening on port ${port}`);

// test retrieving the value of the process variable through the dotenv dependency
// console.log(process.env.MONGO_URI);