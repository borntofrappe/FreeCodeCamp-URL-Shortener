# FreeCodeCamp URL Shortener

> Third of five projects required to earn the **API and Microservices** certification @freeCodeCamp.

Link to the pen making up the UI of the application [right here](https://codepen.io/borntofrappe/full/JmGGob/)

<!-- Link to the working glitch [right here]() -->

## Preface

With this third project I am tasked to create a JavaScript app, similar to the one [referenceed by @freecodecamp](https://thread-paper.glitch.me/).

This is a deceptively simple application which allows to _shorten_ the URL as posted in an input of type text. Simply put:

- detail a URL in the input element shown on the page;

- retrieve a JSON object which describes the URL itself and the shortened version. Such a shortened version allows to forward the user toward the same URL, by simply adding the shortened counterpart to the project's own path.

An instance might help clear any doubt on the purpose of the application:

Say the application's own path is as follows: `https://thread-paper.glitch.me`:

- as the user posts the URL, he/she is offered the mentioned JSON object in the following path:

  ```text
  https://thread-paper.glitch.me/api/shorturl/new
  ```

- the JSON object details the anticipated information. For `https://www.freecodecamp.com` for instance, it offers the following response:

  ```JSON
  {"original_url":"https://www.freecodecamp.com","short_url":2}
  ```

- as the user visits the selected path, followed by the **short_url** itself, he/she is forwarded toward the original URL:

  ```text
  https://thread-paper.glitch.me/api/shorturl/2
  ```

  In the instance forwarding the user exactly to `https://www.freecodecamp.com`.

## Design

The UI behind the application can be found in the `Front-End` folder. The front-end development was the subject of a previous effort, and it is documented [right here](https://github.com/borntofrappe/Practice-Front-End-Web-Development/tree/master/Front-End%20URL%20Shortener).

A simple JavaScript file is included to benefit from the express package, to render on the server the developed UI.

## Development

Admittedly, the project baffled me at first, but after a couple of days, and bit of experimentation with the [working applicatin](https://thread-paper.glitch.me/) provided in the [assignment](https://learn.freecodecamp.org/apis-and-microservices/apis-and-microservices-projects/url-shortener-microservice/), I was able to figure out how the functionality is achieved.

Here's a few things I was able to discern:

- no matter how many times you post the same URL, it returns the same shortened result, specifying an integer;

- for the example URL, requesting a shortened version for `https://www.freecodecamp.com`, the response comprises an incredibly small integer. An almost ironically small integer;

- the shortened version for a page summarising a random search on google returns an integer, let's call it `x`. The shortened version for yet another random search returns another integer, in `x+1`. Check `https://thread-paper.glitch.me/api/shorturl/1246` and `https://thread-paper.glitch.me/api/shorturl/1247` to certify this.

_Obvious conclusion_: the application saves every URL as specified in the POST request. It stores its value alongside an integer value used as ID. It increments the integer for every unique URL. Clever, and less complex than anticipated.

The challenge becomes then how to store the URL as requested through the POST request, which is where **MongoDB** and **Mongoose**, alongside **mLab** come into play.

### mLab

[mLab](https://mlab.com) is used to host the database storing the URLs for the application. Here's a few pointers to get up and running with the service:

- choose to first _create a new database_, picking the most conventient options for the location and features.

- once the database is set up, direct yourself toward the _user_ tab and opt to _add a database user_.

  Detail here a _username_ and a _password_, which need to be remembered as to later link the application and the specific database. Be wise not to tick the _read-only_ checkbox, as you'll want to update the database as needed.

  A JSON object will be automatically generated for each user, with a few details on the role and database.

- in order to connect the database with the application, detail then the _URI code_.

  This code is made up of a string provided by mLab itself, which looks something similar to the following:

  ```code
  mongodb://<dbuser>:<dbpassword>@ds052978.mlab.com:52978/fcc-url-shortener
  ```

  This string needs to be populated with the values for the user and password, in the respective fields. Just remember to substitute the entirety of the `<dbuser>` and `<dbpassword>` values, tags included.

- on [glitch](https://glitch.com), include the URI as a variable in the secret `env` file.

  Remember the following rules for `env` variables:

  - no spaces;

  - no quotes;

  - uppercase;

  - underscore separated.

  Rules making up the variable as follows:

  ```code
  MONGO_URI=mongodb://<dbuser>:<dbpassword>@ds052978.mlab.com:52978/fcc-url-shortener
  ```

- in the JavaScript file, retrieve the URI from any file as follows:

  ```JS
  const URI = process.env.MONGO_URI;
  ```

  Mongoose will come into play to later _connect_ the application to the prescribed database.

  _A small note on local development_: the same process variable can be included from a `.env` file stored locally. In the root of the project folder, save a file with the same syntax used in the Glitch project. Install then the `dotenv` dependency, through node, and require its dependency at the top of the JavaScript file.

  ```code
  npm install dotenv --save
  ```

  ```JS
  // require the dotenv library
  require('dotenv').config();
  ```

  Any `.env` variable will be then accessible as previously detailed:

  ```JS
  // consider the MONGO_URI variable as stored in a `.env` file
  const MONGO_URI = process.env.MONGO_URI;
  ```

### Mongoose

Mongoose is a dependency which allows to easily communicate with a database, and implement CRUD operations. As in **C**reate, **R**ead, **U**pdate, **D**elete.

#### Setup

Just remember to first install the necessary libraries:

```code
npm install mongoose mongodb --save
```

And have them listed in the local `package.json` file.

Once the libraries are installed, require each package storing a reference in a variable.

```JS
const mongodb = require('mongodb');
const mongoose = require('mongoose');
```

And link the application to the database through the `connect` method. This method accepts as argument the URI earlier introduced.

```JS
mongoose.connect(process.env.MONGO_URI);
```

This effectively links the application to the database, and allows to then enact the mentioned four operations.

#### Schemas, Models and Documents

Mongoose interacts with the database through a few key elements:

- a schema, defining the properties and values accepted by a model;

- a model, describing the structure of a document.

A document is ultimately an instance in the database, a series of property value pairs detailing the particular object.

A practical instance, for the project at hand, might help clear past this jargon-y structure.

- create a schema:

  ```JS
  const Schema = mongoose.Schema;
  ```

- create an instance of the schema object, for the specific use case of the application:

  ```JS
  const urlSchema = new Schema();
  ```

  In the instance detail the structure which will be inherited by all documents, passing an object and detailing property value pairs. Detail here fields and the type of the variables the fields accept, as in:

  ```JS
  const urlSchema = new Schema({
    url: String,
    short_url: Number
  });
  ```

  Additional options can be detailed include an object instead of a single value. To specify for instance a default value, or whether the field is required or again unique.

  ```JS
  const urlSchema = new Schema({
    url: {
      type: String,
      required: true
    },
    short_url: {
      type: Number,
      required: true
    }
  });
  ```

- create a model, out of the schema

  This is a constructor from which all documents will be created (and on which all documents will be based). The `model()` function, available through the mongoose library, allows to create such a constructor after the defined instance of the schema, detailing a string for the name of the model and the schema itself.

  ```JS
  const Url = mongoose.model('Url', urlSchema);
  ```

Based on this model, it is possible to detail CRUD operations. For the project at hand, these relate to:

1. create a document for each unique URL;

1. read a document on the basis of a unique, incremented integer value.

More research in the [mongoose docs](https://mongoosejs.com/) is however warranted.

#### Create

A document is created and saved in the database as follows:

1. create the instance of the document, on the basis of the defined model.

```JS
const url = new Url();
```

In between parens specify the fields and values as prescribed by the model's own structure.

```JS
const url = new Url({
  url: 'https://mlab.com',
  short_url: 1
});
```

1. save the document through the `save()` method. This is applied on the document itself and, following the node convention, includes a callback function run whenever the saving functionality is completed.

```JS
url.save((err, data) => {
if (err) throw err;
  console.log(data);
});
```

In this instance, `data` relates to an object detailing the document itself. If the function is successfull, that is.

Ultimately, creating and saving a document is something that needs occurring when posting the URL in the selected form element. That being said, the C in the CRUD set of operations needs to go through _only if_ a document with the same values is not already stored, which is where reading the database comes into play.

#### Read

As mentioned, reading the database might be useful to generate new documents only when necessary. That being said, the primary use case for the R in the CRUD set of operations concerns the `shorurl` path, when the shortened url is included and the page needs to forward the user toward the specified, unshortened page.

It is possible to find a document with a few methods, among which `findOne()`. Applied on the model (first letter conventionally uppercase), it accepts as argument an object detailing the property value pairs of the target document. A callback function can also be included, following the aforementioned node convention.

```JS
Url.findOne({
  short_url: 1
}, (err, data) => {
  if (err) throw err;

  console.log(data);
})
```

The C and R operation relates to one facet of the application. Indeed, it is necessary to include the field's values on the basis of a request, both in a form element, following a POST request, and as a result of a specific URL.

Simply put:

- in `[project_url]/api/shorturl/new`, the app needs to render a JSON object based on the URL received as input. A shorturl value is here specified through an integer and the larger object saved as a document in the database.

- in `[project_url]/api/shorturl/<integer>`, the app needs to forward the viewer toward the selected path. Another core component of Node, the `dns` library, is suggested for this particular feat, which is prompted by reading a document in the database.

#### Update

With the mentioned details, the application needed three of many things.

1. a way to add a `short_url` value, incrementing this integer for every request;

1. a way to validate the input, to create and save documents only for valid URL;

1. a way to redirect the user toward the unshortened url (when including the shortened counterpart in the path of the application).

These feats were achieved as follows:

- the `estimatedDocumentCount()` method is used on the larger model to retrieve the length of the database, the number of documents it stores. The value retrieved from this method allows to include an ever updating `short_url` value;

  ```JS
  Url.estimatedDocumentCount((err, count) => {
    console.log(count);
  })
  ```

- the `dns` core module, already baked in node, provides the `lookup()` method to validate the input of the form element. This method accepts among many arguments the _hostname_ and a callback function. With a valid hostname, it returns the matching IP address, while an invalid input returns `undefined`.

  The hostname, with a bit of experimentation, boils down to the string following the `https://` preface, and discounting any relative path. For instance, and for the following values:

  | url                                             | hostname                |
  | ----------------------------------------------- | ----------------------- |
  | `https://medium.freecodecamp.org/`              | medium.freecodecamp.org |
  | `https://translate.google.com/`                 | translate.google.com    |
  | `https://translate.google.com/#fr/en/something` | translate.google.com    |

  From the input text, it is therefore necessary to first retrieve the hostname value. Something a couple of regular expressions are fit to handle.

  ```JS
  const url = req.body.url;
  const hostname = url
    .replace(/http[s]?\:\/\//, '')
    .replace(/\/(.+)?/, '');
  ```

  Once retrieved, the hostname can be included simply as the first argument of the `lookup()` method. In the callback function it is then possible to handle a possible return value.

  ```JS
  dns.lookup(hostname, (err, addresses) => {
    console.log(addresses);
  }
  ```

  The value returned by the function is either `undefined` or an IP address, depending on whether or not the hostname backs a valid URL. With a simple `if` `else` conditional statement it is possible to handle each case.

Shopping list:

- the `redirect()` method is finally the perfect solution to redirect the user toward the unshortened url. Applied on the response of the getter method, it specifies the directing URL in between parens.

  ```JS
  res.redirect(original_url)M
  ```
