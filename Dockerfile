FROM node

COPY . /var/server

WORKDIR /var/server

RUN npm i
RUN npm run build

ENTRYPOINT [ "node", "./dist/server.js" ]

EXPOSE 443