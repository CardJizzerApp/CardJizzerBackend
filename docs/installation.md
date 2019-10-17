# Installation in production environment

## Docker
If you want to run the service in Docker you need to link the Docker service with a MongoDB and a RedisDB. For the sake of simplicity we would recommend Docker-Compose. The following represents a sample docker-compose file.
```yml
version: '3'

services:
    backend:
        image: docker.pkg.github.com/cardjizzerapp/cardjizzerbackend/server
        ports:
            - "8100:8100"
        environment:
            - MONGO_HOST=mongo
            - REDIS_HOST=redis
            - PORT=8100
        links:
            - redis
            - mongo
    redis:
        image: redis
    mongo:
        image: mongo
```
*Otherwise* you can use just one docker container with the following command:
```sh
$ docker run -p 8100:8100 --name cardjizzer-backend \
             -e MONGO_HOST=mongo \ 
             -e REDIS_HOST=redis \
             -e PORT=8100 \
             docker.pkg.github.com/cardjizzerapp/cardjizzerbackend/server
```

## Running without Docker
1. Clone the repository.
2. Install packages with `npm i`
3. Build with `npm run build`
4. Change the environment [variables](../.env). 
5. Run with `node ./dist/server.js`

### [_Back to table of contents_][index]


[index]: ./index.md
