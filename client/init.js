const auth = require('./auth.js');
const tmi = require('tmi.js');
const twitch = require('../twitch/handles');

/**
 * Initialise client and events, connect to twitch.
 * @return {void}
 */
async function connect() {
  const opts = await auth.auth();
  client = new tmi.Client(opts);
  client.on('message', twitch.onMessageHandler);
  client.on('connected', twitch.onConnectedHandler);
  client.on('disconnected', twitch.onDisconnectedHandler);
  // Connect to Twitch:
  console.log('Trying to connect');
  client.connect();
}

module.exports = {
  connect,
};
