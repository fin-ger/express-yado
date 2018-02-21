from node:alpine

ENV NODE_ENV=production
ADD . /app
WORKDIR /app
RUN npm install
CMD npm start
