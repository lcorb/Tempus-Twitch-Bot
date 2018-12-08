const auth = require("./auth.js"),
      tmi = require("tmi.js"),
      twitch = require("../twitch/handles");

async function connect(){
  var opts = await auth.auth();
  client = new tmi.client(opts);
  client.on('message', twitch.onMessageHandler);
  client.on('connected', twitch.onConnectedHandler);
  client.on('disconnected', twitch.onDisconnectedHandler);
  // Connect to Twitch:
  console.log("Trying to connect");
  client.connect();
}

module.exports = {
  connect
};