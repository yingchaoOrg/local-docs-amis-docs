FROM node:16
WORKDIR /home/
RUN mkdir -p /home/node/www
RUN npm install  -g  http-server
WORKDIR /home/node/www

COPY . /home/node/www
RUN npm i --legacy-peer-deps

EXPOSE 8888

CMD npm start



