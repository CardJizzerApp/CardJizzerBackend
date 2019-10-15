FROM node

COPY . /var/server

WORKDIR /var/server

ARG PORT

RUN npm i
RUN npm run build

ENTRYPOINT [ "node", "./dist/server.js" ]

EXPOSE $PORT