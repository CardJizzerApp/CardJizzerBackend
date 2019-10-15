<div align="center">
    <img src="./res/logo.svg">
    <h1>CardJizzers' Backend</h1>
    <h3>The backend of CardJizzer.</h3>
</div>

<div align="center">
    
[![Build Status](https://travis-ci.com/CardJizzerApp/CardJizzerBackend.svg?branch=master)](https://travis-ci.com/CardJizzerApp/CardJizzerBackend)
[![Gitter](https://badges.gitter.im/CardJizzerApp/community.svg)](https://gitter.im/CardJizzerApp/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![Maintainability](https://api.codeclimate.com/v1/badges/dc12b4b5b1070a4b63e7/maintainability)](https://codeclimate.com/github/CardJizzerApp/CardJizzerBackend/maintainability)

</div>

<div align="center">

[What is this](#what-is-this) | 
[Motivation](#motivation) | 
[Installation](#installation) | 
[Contributing](#contributing)

</div>
<hr/>

## What is this?
### What Is Cards Against Humanity?
The [game][cards-against-humanity], with its [game rules][game-rules] was invented by a Kickstarter campaign in the year 2011.
It is a turn based card game for the most parts played in real life.

Every player receives a specific amount of white cards that are used to fill placeholders provided in the black card.

At the end of the round, when all players played a card, the card czar (in our case the `CardJizzer`) picks the most hilarious card.

On the start of a new round every player gets the amount of whitecards he laid in the last round.

Although there are already clones out there we want to build a open source forgery for the App- and PlayStore. 

We decided to bring fresh air in this game and created this hybrid app which allows anybody to play
this beautiful game anywhere and anytime.

### What is this repo about?
This repository is the backend part of the app. It will be deployed to our servers after your push.

Please follow [this][frontend] link for the frontend part of this project.

## Motivation
Why are we doing this? We want the future of games to be more transparent and modifiable for any developer.

## Installation

### Environment variables
The following code segment shows the environment variables used. (See [`.env`](./.env) for a possible updated version).
```sh
NODE_ENV=dev

REDIS_HOST=localhost
REDIS_PORT=6379

MONGO_DATABASE=cardjizzer-testdb
MONGO_HOST=localhost
MONGO_PORT=27017

SENTRYDSN=INSERTSENTRYDSNHERE

PORT=8100

GOOGLE_OAUTH_CLIENT_ID=CLIENT_ID
```

### Docker
We recommend running this service as a docker container. 

#### Quickstart with Docker-compose
We need two databases: `Redis` and `Mongo`. One is used for temporary caching and the other for permanent storage such as users with their GoogleId and email.

Consequently we suggest using Docker-compose containing all those services named above.

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


## Contributing
Getting a better understanding of the project will be essential before even thinking about contributing.
Thus the commands you need in order to setup your environment. 
```sh
$ npm i && npm run setup
# Checking if build succeeds
$ npm run test
# Building
$ npm run build
# Development
$ npm run dev
```

### Resolved your issue? Contribute!

Please refer to each project's style and [contribution guidelines](CONTRIBUTING.md) for submitting patches and additions. In general, we follow the "fork-and-pull" Git workflow.
 1. **Fork** the repo on GitHub
 2. **Clone** the project to your own machine
 3. **Commit** changes to your own branch
 4. **Push** your work back up to your fork
 5. Submit a **Pull request** so that we can review your changes

NOTE: Be sure to merge the latest from "upstream" before making a pull request!


[cards-against-humanity]: https://cardsagainsthumanity.com/
[game-rules]: http://s3.amazonaws.com/cah/CAH_Rules.pdf
[frontend]: https://github.com/CardJizzerApp/CardJizzerFrontend