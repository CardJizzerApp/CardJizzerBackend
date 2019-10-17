# CardJizzerBackend Documentation

The following documentation contained in the `docs/` folder will give some further insights into the app.

## Getting started
```sh
$ npm i 
$ npm run setup
```

## Running tests
In order to check if your changes will result in a red build and is consequently not commitable please use
the following command.

NOTE: After running the `npm run setup` command the git hooks path will change to `/hooks` and before each commit, the test and the lint command will run.
```sh
$ npm run test
```

## Checking the code style
A good repository needs a unified code style. Therefore we use a package called "`eslint`".
```sh
$ npm run lint
```

## Building
The following command will run some `gulp` tasks which will then minify and copy the source files to the `dist/` folder. 
```sh
$ npm run build
```

## What kind of API?
This is **no** typical HTTP ReST API. All requests are sent over *websockets* guaranteeing live game updates and events for every player connected to the server.

Sending requests is possible only through JSON. For example: `joining a game`
```json
{
    "command": "join",
    "params": {
        "gameid": "some-random-uuid-here"
    }
}
```
Where `command` represents the command to be executed (in the example case: [`join`][join-class])
and `params` the args required by the specific command.


### [_Back to table of contents_][index]


[index]: ./index.md
[join-class]: ../src/commands/join.js
