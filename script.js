// set up an express app
const port = 3000;
const express = require('express');
const app = express();
// require the dotenv library to access local `.env` variables
require('dotenv').config();

// require body parser
const bodyParser = require('body-parser');

// mount the body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// MONGODB && MONGOOSE
// require mongodb and mongoose
const mongodb = require('mongodb');
const mongoose = require('mongoose');

// connect the application to the mLab database through the process variable detailing the URI code
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

// define a schema for the url(s) documents, to be stored and read in the database
const Schema = mongoose.Schema;
const urlSchema = new Schema({
  url: {
    type: String,
    required: true,
  }
});

// define a model, giving structure to all instances (documents)
const Url = mongoose.model('Url', urlSchema);

// EXPRESS && ROUTING
// render the stylesheet as found in the public folder
app.use(express.static(`${__dirname}/public`));

// in the root path render the HTML file found in the views folder
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// following a post request in the selected path, create and save a document
// display then a JSON object with the url and short_url values
// ! if a document exists with the same URL, simply display its values, skipping the create step
app.post('/api/shorturl', function (req, res) {

  // look if the database has already an instance of the url document
  // ! remember how callback functions, as per the node convention, contain te result of the method in a second argument
  Url.findOne({
    url: req.body.url
  }, (err, urlFound) => {
    // findOne() returns either a document or null, if no document matches the specified property value pairs
    if (err) {
      throw err;
    }
    // findOne returns null, create a new document
    if (!urlFound) {
      // create an instance from the information retrieved from the form
      const url = new Url({
        url: req.body.url
      });

      // save the instance in the database
      url.save((err, urlSaved) => {
        if (err) {
          throw err;
        }

        console.log("Document Saved");
        res.json({
          url: urlSaved.url
        })
      });

    }
    // findOne returns an object, procede to detail the information already stored within
    else {
      console.log("Document Found");
      res.json({
        url: urlFound.url
      })
    }
  });

});

// listen in the selected port and render the simple application
app.listen(port);
console.log(`listening on port ${port}`);