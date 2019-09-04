# JSON commands - version 0.0.4
Write the commands in following json structure
```json
{
    "command": "creategame",
    "params": {
        "title": "SomeGame",
        "password": "BigDick",
        "maxPlayers": 200 
    }
}
```
```json
{
    "command": "fetchgames"
}
```
and stringify it.
```
"{\"command\": \"creategame\",\"params\": {\"title\": \"SomeGame\",\"password\": \"BigDick\",\"maxPlayers\": 200}}"
```
Send this in JSON format to the given endpoint.
