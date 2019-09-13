const twitch = require('./message.js');
const knownCommands = require('./commands.js');
const commandPrefix = '!';
const {instance} = require('../main');
const config = require('../client/config.json');

/**
 * Handle for message events.
 * @param {string} target
 * @param {object} context
 * @param {string} msg
 * @param {boolean} self
 */
function onMessageHandler(target, context, msg, self) {
  if (self) {
    return;
  }

  /* var userList = request({
    baseUrl: `http://tmi.twitch.tv/group/user/${}/chatters`,
    headers: {
    'Accept': 'application/json'},
    method: 'GET',
    json: true,
  });*/
  // Not a command
  if (msg.substr(0, 1) !== commandPrefix) {
    console.log(`[${target} (${context['message-type']})] ${context.username}: ${msg}`);
    return;
  }
  msg = msg.toLowerCase();
  const parse = msg.slice(1).split(' ');
  const commandName = parse[0];
  const params = parse.splice(1);
  if (commandName in knownCommands && !config.disabled[commandName]) {
    const command = knownCommands[commandName];
    if (!params.length && knownCommands.commandList[commandName].usage) {
      console.log(`[Tempus-Twitch-Bot ${target}] Failed ${commandName} command for ${context.username}`);
      twitch.sendMessage(target, context, `@${context.username} Usage: ${commandPrefix}${commandName} ${knownCommands.commandList[commandName].usage}`);
    } else {
      command(target, context, params);
      console.log(`[Tempus-Twitch-Bot ${target}] Executed ${commandPrefix}${commandName} command for ${context.username}`);
    }
  } else {
    let found = false;
    Object.entries(knownCommands.commandList).forEach(function(value) {
      if (value[1].hasOwnProperty(`alias`)) {
        for (i = 0; i < value[1].alias.length; i++) {
          if (value[1].alias[i] === commandName && value[1].alias[i]) {
            if (config.disabled[value[0]] !== undefined) {
              return;
            } else {
              if (!params.length && value[1].usage) {
                console.log(`[Tempus-Twitch-Bot ${target}] Failed ${commandName} command for ${context.username}`);
                twitch.sendMessage(target, context, `@${context.username} Usage: ${commandPrefix}${value[1].alias[i]} ${value[1].usage}`);
              } else {
                found = true;
                knownCommands[value[0]](target, context, params);
                console.log(`[Tempus-Twitch-Bot ${target}] Executed alias ${commandPrefix}${value[1].alias[i]} command for ${context.username}`);
              }
            }
          }
        }
      }
    });
    if (!found) {
      console.log(`[Tempus-Twitch-Bot ${target}] Found unknown !${commandName} command for ${context.username}`);
    }
  }
}

/**
 * Handle for OnConnected event.
 * @param {string} address
 * @param {string} port
 */
function onConnectedHandler(address, port) {
  console.log(`[Tempus-Twitch-Bot] Connected to ${address}:${port}`);
}

/**
 * Handle for OnDisconnected event.
 * @param {string} reason
 */
function onDisconnectedHandler(reason) {
  console.log(`[Tempus-Twitch-Bot] Disconnected: ${reason}`);
  instance.connect();
  console.log(`[Tempus-Twitch-Bot] Reconnecting...`);
}

module.exports = {
  onMessageHandler,
  onConnectedHandler,
  onDisconnectedHandler,
};
