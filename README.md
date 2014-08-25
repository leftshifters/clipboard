# Clipboard
A simple app to upload and share files.

## Features

* Supports Over The Air installation of iOS builds aka IPA files
  * Automatically reads all meta information from IPAs on upload
* Full Text Search on name, original filename and file type
* Easily share IPA & APK files using auto generated QR Codes
* Upload files via REST API

## Install

Clone the repository

````
git clone git@github.com/leftshifters/clipboard
npm install
````

## Configuration

You can mostly configure database endpoints and other settings via Environment variables. Set the following env vars before starting the server process. You may connect to a remote MongoDB or ElasticSearch cluster.

```
MONGO_HOST                // defaults to 'localhost'
MONGO_PORT                // defaults to 27017
MONGO_DB_NAME             // defaults to 'clipboard'
ELASTICSEARCH_HOST        // defaults to 'localhost',
ELASTICSEARCH_PORT        // defaults to 9200
ELASTICSEARCH_LOG_LEVEL   // defaults to error
```

## Run
To run

````
node app.js
````

If you want to run the server till eternity, you can copy the upstart config file `clipboard.conf` to `/etc/init` and use service utility to start the process

````
$ sudo service start clipboard
````

## Color Palette

Using this [color palette](http://www.colourlovers.com/palette/3259773/Snowbound)

## Have fun!
Tell your browser to open `http://localhost:3000` and have fun!