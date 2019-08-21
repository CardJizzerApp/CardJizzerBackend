#!/usr/bin/env python
import codecs
import sys
import os


def createEvent(event_name):
    event_name_capitalized = event_name.capitalize()
    event_template = """
const {Event} = require('./event');
const {Game} = require('../game');
const {ErrorCodeHelper, Responses} = require('../helper');

const ech = new ErrorCodeHelper();

exports.EVN = class extends Event {

    /**
     * @param {Game} game 
     */
    trigger(game) {
        for (let i = 0; i !== game.players.length; i++) {
            const player = game.players[i];
            const websocket = player.websocket;
            websocket.send(ech.sendResponse(Responses.RESPONSE_HERE, null));
        }
    }

}
    """.replace("EVN", event_name_capitalized)
    path = os.path.join(os.getcwd(), "src", "events", event_name + ".js")
    print(path)
    file = codecs.open(path, "w", "utf-8")
    file.write(event_template)
    file.close()

args = sys.argv[1::]

if str(args[0]).lower() == "createevent":
    if len(args) != 2:
        print("[!] Please enter a event name.")
    else:
        print(args[1])
        createEvent(str(args[1]))
