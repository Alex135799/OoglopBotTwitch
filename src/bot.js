require('dotenv').config()
const tmi = require('tmi.js');
const axios = require('axios');

const botConfig = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: JSON.parse(process.env.CHANNEL_NAMES)
};

const backendUrl = "https://k301suduv8.execute-api.us-east-1.amazonaws.com/default/";

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
      case "tennis":
        console.log(`Playing: ping-pong`);
        ping(command, target).then(function(data) {
          console.log(data)
        });
        break;
      case "join":
        console.log(`${context.username} is joining a queue`);
        join(command, target, context, message).then(function(data) {
          console.log(data)
        });
        break;
      default:
        console.log(`I dont know how to \"${command}\" yet... don't tease me!`)
    }
  }
}

var ping = async(command, target) => {
  client.say(target, `tennis`);
}

var join = async(command, target, context, msg) => {
  let channelName = target.substr(1);
  let user = {
    "id": context["user-id"],
    "name": context.username,
    "type": "twitch"
  };
  let queueEntry = await joinSession(user, channelName);
  if (!queueEntry.err) {
    client.say(target, `@${context["display-name"]} has joined the queue.`);
  }
}

var joinSession = async (user, channelName) => {
  try {
    let request = {
      "user": user,
      "streamName": channelName
    }
    let response = await axios.post(backendUrl + "queue/entry", JSON.stringify(request));
    return response.data.saved.Item;
  }
  catch (err) {
    if (!err.response) {
      console.log(err);
      return({err: err});
    }
    console.log(err.response.data);
    return({err: err.response.data});
  }
}

function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
