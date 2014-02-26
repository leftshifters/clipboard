#Leftload
A simple app to upload and share files

## Install

### Dependencies

Depends on the graphicsmagick v1.3.8 or higher.

### Ubuntu or Debian
````
$ sudo apt-get install graphicsmagick
````

### Homebrew
````
$ brew install graphicsmagick
````

Clone the repository

````
git clone git@github.com/vxtindia/leftload
npm install
````

## Run
To run

````
node app.js
````

If you want to run the server till eternity, you can copy the upstart config file `leftload.init` to `/etc/init` and use service to start the process

````
$ sudo service start leftload
````

## Color Palette

Using this [color palette](http://www.colourlovers.com/palette/3259773/Snowbound)

## Have fun!
Tell your browser to open `http://localhost:3000` and have fun!
