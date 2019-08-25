FROM node

COPY . /var/server

WORKDIR /var/server

ARG WS_PORT=443

RUN npm i
RUN npm run build

ENTRYPOINT [ "node", "./dist/server.js" ]

EXPOSE ${WS_PORT}