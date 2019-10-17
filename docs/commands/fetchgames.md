# Fetch Games

This command is a non-`auth-required` command used for getting a list of all active games.

Once sent the backend will then process the request and return a list of all the active lobbies.
Those lobbies can have any state. In a upcoming version there might be a filter for states.

NOTE: It does not require any arguments.

## Sample
```json
{
    "command": "fetchgames",
}
```

### [_Back to table of contents_][index]


[index]: ./index.md