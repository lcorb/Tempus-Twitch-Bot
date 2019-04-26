const auth = require('./auth.js');
const tmi = require('tmi.js');
const twitch = require('../twitch/handles');
const APICache = require(`../cache/cache`);

/**
 * Create empty global cache
 */
const cache = new APICache;

/**
 * Initialise client and events, connect to twitch.
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
  cache,
  connect,
};
