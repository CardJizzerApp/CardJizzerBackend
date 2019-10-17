# Events

Events are the main reason this backend operates with websockets. We want to provide real time updates to the player. He sould instantly get notified when something in the game changes.

A event is basically a response (like you may know it from the [protocol](protocol-docs) docs).

## Sample event
```json
{
    "errorCode": 1000108,
    "message": "A new game was created",
    "jsonData": {
        "gameId": 0
    }
}
```

A recommendation (and also implementation in the CardJizzerFrontend) is to use the `websocket.onmessage` function, so that whenever a event was sent by the backend the frontend instantly gets those important information.


### [_Back to table of contents_][index]


[index]: ./index.md
[protocol-docs]: ./protocol.md