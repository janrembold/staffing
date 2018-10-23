FROM node:carbon-alpine

RUN mkdir app

WORKDIR /app

ADD ./server.js /app
ADD ./db /app/db

RUN npm init -y
RUN npm install json-server

EXPOSE 5544

ENTRYPOINT node server.js
