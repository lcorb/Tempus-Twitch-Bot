const tmi = require('tmi.js');
const twitch = require('../twitch/handles');
const AdvertiseManager = require('../twitch/advertise');
const config = require('./config.json');

/**
 * Initialise client and events, connect to twitch.
 */
async function connect() {
  const opts = config.account;
  client = new tmi.Client(opts);
  client.on('message', twitch.onMessageHandler);
  client.on('connected', twitch.onConnectedHandler);
  client.on('disconnected', twitch.onDisconnectedHandler);
  // Connect to Twitch:
  console.log('[Tempus-Twitch-Bot] Trying to connect...');
  client.connect();
}

const ad = new AdvertiseManager;

module.exports = {
  connect,
  ad,
};
