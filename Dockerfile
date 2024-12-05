FROM node:16
WORKDIR /home/
RUN mkdir -p /home/node/www
# RUN npm install  -g  http-server  --registry=https://registry.npmmirror.com
RUN npm install  -g  http-server  
WORKDIR /home/node/www

COPY . /home/node/www


# RUN npm i --legacy-peer-deps --registry=https://registry.npmmirror.com

WORKDIR /home/node/www/packages/office-viewer
RUN npm i --legacy-peer-deps
WORKDIR /home/node/www
RUN npm i --legacy-peer-deps

WORKDIR /home/node/www
RUN npm run build --workspaces
RUN ./deploy-gh-pages.sh
EXPOSE 80
CMD http-server ./gh-pages -p 80 -a 0.0.0.0

# CMD npm start



