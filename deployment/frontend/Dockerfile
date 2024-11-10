FROM node:22-alpine

WORKDIR /home/node/app

COPY ./frontend/package*.json .

RUN npm install

COPY ./messages ../messages
COPY ./frontend .

RUN npm run build
