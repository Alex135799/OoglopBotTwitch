require('dotenv').config()
const tmi = require('tmi.js');

const botConfig = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    process.env.CHANNEL_NAME_1
  ]
};

const client = new tmi.client(botConfig);
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  const message = msg.trim();

  if (message.startsWith("oo")) {
    const command = message.substring(2).trim();
    switch(command) {
      case "ping":
        console.log(`Playing: ${command}-pong`)
        ping(command, target);
        break;
      default:
        console.log(`I dont know how to \"${command}\" yet... don't tease me!`)
    }
  }
}

function ping(command, target) {
  client.say(target, `pong`);
}

function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}