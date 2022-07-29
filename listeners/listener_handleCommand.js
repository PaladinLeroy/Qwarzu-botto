const { Listener } = require("./Listener.js");
const commands = require("../commands/commands.js");
const { splitWithBrackets } = require("../helper/splitCommand.js");

const exec = async (message) => {
    let command = message.content;
    if (command[0] !== "?") {
        return;
    }

    if (message.author.bot) {
	return;
    }
    
    let commandAndArgs = splitWithBrackets(command);
    
    let commandName = commandAndArgs[0].toLowerCase();
    let args = commandAndArgs.slice(1);

    const commandObj = commands[commandName];
    if (commandObj) {
        const result = await commandObj.wrappedExec(message, args);

	if (!result) {
	    await message.channel.send(commandName + " - No output");
	    return;
	}
	if (!result.string) {
	    await message.channel.send(commandName + " - No string");
	}
	await message.channel.send(result.string);
    }
}

const description = `Listener type: messageCreate

Whenever a message is sent it checks if it's a command and executes it.`;

const handleCommand = new Listener("handlecommand", description, exec, "messageCreate")
handleCommand.enabled = true //This one needs to be enabled by default

module.exports = handleCommand
