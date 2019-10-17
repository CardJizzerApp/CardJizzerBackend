# The Command class

The command class located in `src/command.js` is the base class for every command.

It consists of a few essential functions checking whether the websocket is logged in and can be assiciated with a user, as well as
checking if the user is currently in game. For the most commands those few functions will be enough.

If you add a command using a function that may be relevant to other commands coming up in the future you better implement this function in the base (`command`) class.

NOTE: The term `ws` is associated with `websocket` and `cb` the short form of `callback` resulting in a minimized code.

## Functions accessible by children of a command
`setRedis(key, value) => Promise<boolean>`

`getRedis(key) => Promise<any>`

`isUserLoggedIn(websocket, cb) => cb()`

`isGameInProgress(gameId, cb(game, err)) => cb()`

`getGame(gameId, cb(game)) => cb()`

`isInGame(ws, cb(game, player, err)) => cb()`


### [_Back to table of contents_][index]


[index]: ./index.md