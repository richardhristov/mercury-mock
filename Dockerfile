FROM node:16-alpine

WORKDIR /usr/src/app

COPY ./* ./
RUN npm install --production
RUN npm run build

CMD ["npm", "run", "start"]
