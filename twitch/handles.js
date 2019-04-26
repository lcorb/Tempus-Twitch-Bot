const twitch = require('./message.js');
const knownCommands = require('./commands.js');
const commandPrefix = '!';

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
  if (commandName in knownCommands) {
    const command = knownCommands[commandName];
    if (!params.length && knownCommands.commandList[commandName].usage) {
      console.log(`Failed ${commandName} command for ${context.username}`);
      twitch.sendMessage(target, context, `@${context.username} Usage: ${commandPrefix}${commandName} ${knownCommands.commandList[commandName].usage}`);
    } else {
      command(target, context, params);
      console.log(`Executed ${commandPrefix}${commandName} command for ${context.username}`);
    }
  } else {
    let found = false;
    Object.entries(knownCommands.commandList).forEach(function(value) {
      if (value[1].hasOwnProperty(`alias`)) {
        for (i = 0; i < value[1].alias.length; i++) {
          if (value[1].alias[i] === commandName) {
            found = true;
            knownCommands[value[0]](target, context, params);
            console.log(`Executed alias ${commandPrefix}${value[1].alias[i]} command for ${context.username}`);
          }
        }
      }
    });
    if (!found) {
      console.log(`Found unknown !${commandName} command for ${context.username}`);
    }
  }
}

/**
 * Handle for OnConnected event.
 * @param {string} address
 * @param {string} port
 */
function onConnectedHandler(address, port) {
  console.log(`Connected to ${address}:${port}`);
}

/**
 * Handle for OnDisconnected event.
 * @param {string} reason
 */
function onDisconnectedHandler(reason) {
  console.log(`Disconnected: ${reason}`);
  console.log(`Reconnecting...`);
}

module.exports = {
  onMessageHandler,
  onConnectedHandler,
  onDisconnectedHandler,
};
