## Riplive.it Icecast Api

A real time NodeJS server.  
An application that parse a HTTP Icecast medata, and broadcast the current onair song to all connected clients. 

## Installation and run
Clone the repository, than install all application's dependencies:  

    $ npm install --production  

Launch all unit tests with:  

	$ mocha -R spec tests  

Run the application: 

	$ node app.js  

##  Continuous integration and Deployment

All builds, tests and deployment are running against a Jenkins server available at 

build.riplive.it:8080
