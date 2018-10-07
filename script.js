// set up an express app
const port = 3000;
const express = require('express');
const app = express();
// require the dotenv library to access local `.env` variables
require('dotenv').config();
// require the dns module, to check the validity of the input url
const dns = require('dns');
// require the body parser library to properly retrieve the form's value
const bodyParser = require('body-parser');
// require mongodb and mongoose libraries for the database
const mongodb = require('mongodb');
const mongoose = require('mongoose');

// mount the body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// render the stylesheet as found in the public folder
app.use(express.static(`${__dirname}/public`));

// MONGO && MONGOOSE
// connect the application to the mLab database through the process variable detailing the URI code
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true
});

// define a schema for the url(s) documents, to be stored and read in the database
const Schema = mongoose.Schema;
// each instance shall have two fields, with a string representing the original URL and an integer the shortened counterpart
const urlSchema = new Schema({
  original_url: {
    type: String,
    required: true
  },
  short_url: {
    type: Number,
    required: true,
    default: 0
  }
});

// define a model, on which all instances (documents) will be based
const Url = mongoose.model('Url', urlSchema);

// EXPRESS && ROUTING
// in the root path render the HTML file as found in the views folder
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// following a post request in the selected path, create and save a document
app.post('/api/shorturl', function (req, res) {
  /** path's logic
   * through the dns module check if the input valid represents a valid url
   * through the findOne() function check if the database already contains an entry for the url
   *  no existing entry
   *    check the length of the database
   *    create a new entry
   *    save the entry
   *    read its values
   * 
   *    existing entry
   *    read its values
   */

  // store in a variable the requested url
  const urlRequest = req.body.url;

  // DNS MODULE
  // retrieve the hostname removing from the url (the section between https:// and relative paths)
  const hostname = urlRequest
    .replace(/http[s]?\:\/\//, '')
    .replace(/\/(.+)?/, '');

  // console.log(hostname);
  // use the hostname in the lookup function
  dns.lookup(hostname, (err, addresses) => {
    if(err) {
      res.send("lookup error");
    }

    // lookup() returns either _undefined_ or an IP address
    // if undefined , send a JSON object detailing the invalid nature of the request
    if(!addresses) {
      res.json({
        "error": "Invalid url"
      });
    }
    // if an IP address is returned, proceed creating and or displaying the JSON object fit for the request
    else {

      // CHECK EXISTING ENTRY
      Url.findOne({
        original_url: urlRequest
      }, (err, urlFound) => {
        if(err) {
          res.send("findOne error");
        }
        // findOne() returns either a document or null, if no document matches the specified property value pair(s)
        // if null, create a new document, save it in the database and display its information
        if(!urlFound) {
          // check the number of documents in the database, to add a unique short_url, made up of an integer equal to the length + 1
          console.log("Document Not Found")

          Url.estimatedDocumentCount((err, count) => {
            if(err) {
              res.send("estimatedDocumentCount() error")
            }

            console.log(count);
            // create a document
            const url = new Url({
              original_url: req.body.url,
              short_url: count + 1
            });
            
            // save the document in the database
            url.save((err, urlSaved) => {
              if(err) {
                res.send("save() error")
              }
              console.log("Document Saved");
              console.log(urlSaved);
  
              // send a json object detailing the values of the saved url
              res.json({
                original_url: urlSaved.original_url,
                short_url: urlSaved.short_url
              })
  
            });
          });

        }

        // if findOne returns insread an object, display its information
        else {
          console.log("Document Found");
          res.json({
            original_url: urlFound.original_url,
            short_url: urlFound.short_url
          });
        }


      });

    }
    
  });
});


// following a get request at the selected path, re-route the visitor toward the unshortened url
// if an entry in the database matches the shorturl value that is
app.get('/api/shorturl/:shorturl', function (req, res) {
  // retrieve the requested short url through the request parameter
  const shorturl = req.params.shorturl;

  // lookf for a document in the database with the matching shorturl
  Url.findOne({
    short_url: shorturl
  }, (err, urlFound) => {
    if(err) {
      res.send("findOne() error")
    }
    // once again, findOne() can either return null or an object matching the property value pair(s)
    // returns null, return a message relating the lack of shortened url
    if(!urlFound) {
      res.json({
        "error": "no url matches the shortened url"
      });
    }
    // returns a document matching the short url, forward toward the unshortened url
    // using the redirect() method
    else {
      res.redirect(urlFound.original_url);
    }
  });

});

// listen in the selected port and render the simple application
app.listen(port);
console.log(`listening on port ${port}`);
