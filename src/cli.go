package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"runtime"
	"strings"

	"github.com/urfave/cli"
)

var _, filename, _, ok = runtime.Caller(1)

var commandTemplate = `const {Command} = require('../command');
const {ErrorCodeHelper, Responses} = require('../helper');
const ech = new ErrorCodeHelper();

exports.{{className}} = class extends Command {
    /**
     * Join [gameUUID: UUID / string]
     */
    constructor() {
        super('{{commandName}}', ['gameid']);
    }
    /**
     * @param {string[]} args
     * @param {Websocket} ws
     * @return {string}
     */
    run(args, ws) {
    }
};

`

var eventTemplate = `const {Event} = require('./event');
const {ErrorCodeHelper, Responses} = require('../helper');

const ech = new ErrorCodeHelper();

exports.{{className}} = class extends Event {
    /**
     * @param {ChangeAction} action
     * @param {*} jsonData
     */
    trigger(action, jsonData) {
    }
};

`

var app = cli.NewApp()
var path, _ = os.Getwd()

func info() {
	app.Author = "IJustDev"
	app.Version = "0.0.1"
	app.Name = "CLI"
}

func checkArgsAmount(argsLen int) bool {
	if argsLen != 1 {
		fmt.Println("[!] Please enter a name for the command / event")
		return false
	}
	return true
}

func createFileFromTemplate(command bool, name string) bool {
	template := ""
	if command {
		template = commandTemplate
	} else {
		template = eventTemplate
	}
	className := name
	fileName := strings.ToLower(className)
	fmt.Println(fileName)
	err := ioutil.WriteFile("", []byte(template), 0644)
	if err != nil {
		return false
	}
	return true
}

func commands() {
	app.Commands = []cli.Command{
		{
			Name:    "createcommand",
			Aliases: []string{"createCommand", "cc"},
			Usage:   "Create a command from template",
			Action: func(c *cli.Context) {
				args := c.Args()
				if checkArgsAmount(len(args)) {
					// createFileFromTemplate(commandTemplate, className)
					fmt.Println(args)
				}
			},
		},
		{
			Name:    "createevent",
			Aliases: []string{"ce"},
			Usage:   "Create a event from template",
			Action: func(c *cli.Context) {
				args := c.Args()
				if checkArgsAmount(len(args)) {
					name := args[0]
					fmt.Println(name)
				}
			},
		},
	}
}

func main() {
	info()
	commands()
	err := app.Run(os.Args)
	if err != nil {
		log.Fatal(err)
	}
}
