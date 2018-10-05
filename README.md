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

## Development

Admittedly, the project baffled me at first, but after a couple of days, and bit of experimentation with the [working applicatin](https://thread-paper.glitch.me/) provided in the [assignment](https://learn.freecodecamp.org/apis-and-microservices/apis-and-microservices-projects/url-shortener-microservice/), I was able to figure out how the functionality is achieved.

Here's a few things I was able to discern:

- no matter how many times you post the same URL, it returns the same shortened result, specifying an integer;

- for the example URL, requesting a shortened version for `https://www.freecodecamp.com`, the response comprises an incredibly small integer. An almost ironically small integer;

- the shortened version for a page summarising a random search on google returns an integer, let's call it `x`. The shortened version for yet another random search returns another integer, in `x+1`. Check `https://thread-paper.glitch.me/api/shorturl/1246` and `https://thread-paper.glitch.me/api/shorturl/1247` to certify this.

_Obvious conclusion_: the application saves every URL as specified in the POST request. It stores its value alongside an integer value used as ID. It increments the integer for every unique URL. Clever, and less complex than anticipated.

The challenge becomes then how to store the URL as requested through the POST request, which is where **MongoDB** and **Mongoose**, alongside **mLab** come into play.
