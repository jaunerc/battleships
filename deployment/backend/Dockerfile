FROM node:22-alpine

WORKDIR /home/node/app

COPY ./backend/package*.json .

RUN npm install

COPY ./messages ../messages
COPY ./backend .

RUN npm run build
