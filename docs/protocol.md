# Protocol

This section contains the most important protocol rules. For example the basic structure of a command and a response.

## Commands
```json
{
    "command": "join",
    "params": {
        "gameId": "some-random-uuid-here"
    }
}
```

## Responses
Responses are sent whenever a user (frontend) sends a command to the websocket or something happened to the game (e. g. a player joined or left the game).
```json
{
    "errorCode": 0,
    "message": "OK",
    "jsonData": null
}
```

Every event has got its own errorCode (see [helper.js] for a list of currently implemented events).

### [_Back to table of contents_][index]


[index]: ./index.md
[helper.js]: ../src/helper.js
