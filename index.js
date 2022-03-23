const { Client, Intents } = require('discord.js');
const { token } = require("./config.json");

const client = new Client({ 
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents: ['DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILDS'] 
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", message => {
    console.log(`${message.author.tag}: ${message.content}`)
    
    handleCommand(message);
});

function handleCommand(message) {
    let command = message.content;
    if(command[0] !== "?") {
        return;
    }
    
    let commandAndArgs = command.slice(1).toLowerCase().split(" ")
    
    let commandName = commandAndArgs[0];
    let args = commandAndArgs.slice(1);
    
    if(commands[commandName]) {
        commands[commandName].function(message);
    }
}

let commands = {
    "ping": {
        "description": "The ping command",
        "function": ping
    }
}

function ping(message) {
    message.reply('Pong!');
}

client.login(token);





