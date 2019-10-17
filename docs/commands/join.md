# Join

This command is an `auth-required` command used for joining an currently active game which is neither in state `INGAME` nor `STOPPED`.

Every lobby will get assigned the state `LOBBY` after creation. Once started by the owner the game will change its state and the users will receive their cards.

Furthermore a new `round` object will be assigned to the game object.

## Sample
```json
{
    "command": "join",
    "params": {
        "gameid": "some-random-uuid-here"
    }
}
```

Where `gameid` is the id received from the [`fetchGames`][fetchgames] command.


### [_Back to table of contents_][index]


[index]: ./index.md
[fetchgames]: ./fetchgames.md