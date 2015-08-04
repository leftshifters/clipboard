FROM node

MAINTAINER Debjeet Biswas <debjeet@leftshift.io>

EXPOSE 3000

RUN mkdir /src

COPY . /src

WORKDIR /src

RUN ["npm", "install"]

RUN ["npm", "install", "-g", "gulp"]

ENTRYPOINT ["gulp", "start"]
