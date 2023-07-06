FROM node:16-alpine

WORKDIR /src/server

COPY package*.json ./
COPY . .

RUN npm install --omit=dev

CMD [ "npm", "start" ]
