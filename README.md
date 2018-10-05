# FreeCodeCamp URL Shortener

> Third of five projects required to earn the **API and Microservices** certification @freeCodeCamp.

<!-- Link to the working glitch right here -->

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

The UI behind the application can be found in the `Front-End` folder. The front-end development was the subject of a previous effort, and it is documented right [here](https://github.com/borntofrappe/Practice-Front-End-Web-Development/tree/master/Front-End%20URL%20Shortener).
