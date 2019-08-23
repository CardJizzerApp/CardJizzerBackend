FROM node

COPY . /var/server

WORKDIR /var/server

ARG WS_PORT=80

RUN npm i

RUN npm run prod

ENTRYPOINT [ "node", "./dist/server.js" ]

EXPOSE ${WS_PORT}