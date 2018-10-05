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

[mLab](https://mlab.com) is used to host the database storing the URLs behind the application. Here's a few pointers to get up and running with the service:

- choose to first _create a new database_, picking the most conventient options for the location and features;

- once the database is set up, direct yourself toward the _user_ tab and opt to _add a database user_.

  Detail here a _username_ and a _password_, which need to be remembered to later connect the application. Be wise not to tick the _read-only_ checkbox, as you'll want to update the database as needed.

  A JSON object will be automatically generated for each user, with a few details on the role and database.

- in order to connect the database with the application, detail then the _URI code_.

  This code is made up of a string provided by mLab itself, which looks something similar to the following:

  ```code
  mongodb://<dbuser>:<dbpassword>@ds052978.mlab.com:52978/fcc-url-shortener
  ```

  And needs to be populated with the values for the user and password. Just remember not to substitute the entirety of the `<dbuser>` and `<dbpassword>` values, tags included.

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

### Mongoose

Mongoose is a dependency which allows to easily communicate with a database, and implement CRUD operations. As in **C**reate, **R**ead, **U**pdate, **D**elete.

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

#### Mongoose Jargon

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
    id: Number
  });
  ```

  Additional options can be detailed include an object instead of a single value. To specify for instance a default value, or whether the field is required or again unique.

  ```JS
  const urlSchema = new Schema({
    url: {
      type: String,
      required: true
    }
  });
  ```

- create a model, out of the schema

  This is a constructor from which all documents will be created. The `model()` function, available through the mongoose library, allows to create such a constructor after the defined instance of the schame, detailing a string for the name of the model and the schema itself.

  ```JS
  const Url = mongoose.model('Url', urlSchema);
  ```

Based on this model, it is possible to detail CRUD operations. For the project at hand, these relate to:

1. create a document for each unique URL;

1. read a document on the basis of a unique, incremented integer value.

More research in the [mongoose docs](https://mongoosejs.com/) is however warranted.
