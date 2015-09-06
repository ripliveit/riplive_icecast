## Riplive.it Icecast Api
> A real time NodeJS server.

[![Build Status](https://travis-ci.org/ripliveit/riplive_icecast.svg?branch=master)](https://travis-ci.org/ripliveit/riplive_icecast)

An application that parse a HTTP Icecast medata, and broadcast the current onair song to all connected clients. 

## Installation and run
Clone the repository, than install all application's dependencies:  

    $ npm install --production  

Launch all unit tests with:  

	$ mocha -R spec tests  

Run the application: 

	$ node app.js