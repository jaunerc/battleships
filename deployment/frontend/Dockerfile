FROM node:22-alpine

WORKDIR /home/node/app

COPY ./frontend/package*.json .

RUN npm install

COPY ./shared ../shared
COPY ./frontend .

RUN npm run build

CMD ["npm", "run", "prod"]
