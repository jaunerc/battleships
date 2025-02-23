FROM node:22-alpine

WORKDIR /home/node/app

COPY ./backend/package*.json .

RUN npm install

COPY ./shared ../shared
COPY ./backend .

RUN npm run build

CMD ["node", "./dist/app/src/main.js"]
